/**
 * /api/visitors — visitor country tracking endpoint.
 *
 * GET  → returns { countries: string[] } — sorted, deduplicated ISO-3166 alpha-2 codes.
 * POST → resolves the caller's country, records it if new, returns updated list.
 *
 * Geolocation priority (resolveCountry):
 *   1. x-vercel-ip-country header  — injected by Vercel Edge Network (most accurate).
 *   2. cf-ipcountry header          — injected by Cloudflare (when behind CF proxy).
 *   3. ip-api.com lookup            — fallback for self-hosted / bare deployments;
 *                                     uses the first IP in x-forwarded-for.
 *   4. VISITOR_DEV_COUNTRY env var  — used in local development (defaults to "IN")
 *                                     so the map widget is testable without deploy infra.
 *
 * Persistence:
 *   - Primary: flat JSON file at /data/visitors.json  { countries: string[] }
 *   - Fallback: process-level in-memory Set when the filesystem is read-only
 *     (e.g. serverless environments). In-memory state is lost on cold-start.
 *   - Consider replacing with Upstash / Vercel KV for durable serverless storage.
 */
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Persisted store: flat JSON at project root /data/visitors.json
// Shape: { countries: string[] }  (uppercase ISO-3166 alpha-2 codes, deduped)
// Note: on read-only serverless filesystems this will fall back to a process-
// level in-memory cache. Swap in Upstash/Vercel KV later if you deploy there.
const DATA_DIR  = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "visitors.json");

let memoryCache: Set<string> | null = null;

/**
 * Returns true when the request originates from a local/private network.
 * Covers loopback (127.x, ::1), RFC-1918 private ranges (192.168.x, 10.x),
 * and localhost hostnames. Used to skip real geo lookups in dev mode.
 */
function isLocalRequest(req: Request) {
  const host = req.headers.get("host") ?? "";
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  // x-forwarded-for may be a comma-separated list; the leftmost IP is the client.
  const ip = fwd.split(",")[0]?.trim();

  return (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    !ip ||
    ip === "::1" ||          // IPv6 loopback
    ip.startsWith("127.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
  );
}

async function readCountries(): Promise<Set<string>> {
  if (memoryCache) return memoryCache;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as { countries?: string[] };
    memoryCache = new Set(parsed.countries ?? []);
  } catch {
    memoryCache = new Set();
  }
  return memoryCache;
}

async function writeCountries(set: Set<string>) {
  memoryCache = set;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify({ countries: Array.from(set).sort() }, null, 2),
      "utf8",
    );
  } catch {
    // Read-only FS. In-memory cache still holds the value for this instance.
  }
}

/**
 * Resolve an ISO-3166 alpha-2 country code for the request.
 * Priority:
 *   1. Vercel edge headers (x-vercel-ip-country)
 *   2. Cloudflare header (cf-ipcountry)
 *   3. Fallback: fetch ip-api.com using x-forwarded-for IP
 * Returns null when nothing works (e.g. localhost).
 */
async function resolveCountry(req: Request): Promise<string | null> {
  const h = req.headers;
  const vercel = h.get("x-vercel-ip-country");
  if (vercel) return vercel.toUpperCase();
  const cf = h.get("cf-ipcountry");
  if (cf && cf !== "XX") return cf.toUpperCase();

  const fwd = h.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0]?.trim();

  // Local development has no trustworthy geo headers, so use a stable
  // fallback to make the widget testable without deployment infra.
  if (isLocalRequest(req)) {
    return process.env.VISITOR_DEV_COUNTRY?.toUpperCase() || "IN";
  }

  const url = `https://ipapi.co/${ip}/country/`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const code = (await res.text()).trim();
    return code.length === 2 ? code.toUpperCase() : null;
  } catch {
    return null;
  }
}

/** Returns the current set of visited countries for the map widget. */
export async function GET(req: Request) {
  if (!rateLimit(getClientIp(req), 60)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const set = await readCountries();
  return NextResponse.json({ countries: Array.from(set).sort() });
}

/**
 * Records the calling visitor's country (if not already in the set) and
 * returns the updated list. The `added` field in the response will be the
 * new country code on first visit, or null if it was already known.
 */
export async function POST(req: Request) {
  if (!rateLimit(getClientIp(req), 30)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const code = await resolveCountry(req);
  if (!code) {
    // Could not resolve a country (e.g. private IP without VISITOR_DEV_COUNTRY).
    const set = await readCountries();
    return NextResponse.json({ countries: Array.from(set).sort(), added: null });
  }
  const set = await readCountries();
  const hadIt = set.has(code);
  if (!hadIt) {
    set.add(code);
    await writeCountries(set);
  }
  return NextResponse.json({
    countries: Array.from(set).sort(),
    added: hadIt ? null : code, // null = already recorded; string = newly added
  });
}
