/**
 * Simple in-memory sliding-window rate limiter for API routes.
 * Tracks request timestamps per IP and rejects requests exceeding the limit.
 */

const store = new Map<string, number[]>();

/** Remove entries older than the window. Runs on every check. */
function cleanup(key: string, windowMs: number, now: number) {
  const timestamps = store.get(key);
  if (!timestamps) return;
  const cutoff = now - windowMs;
  const valid = timestamps.filter((t) => t > cutoff);
  if (valid.length === 0) store.delete(key);
  else store.set(key, valid);
}

/**
 * Returns true if the request should be allowed, false if rate-limited.
 *
 * @param ip - Client IP address (from x-forwarded-for or similar)
 * @param limit - Max requests allowed within the window
 * @param windowMs - Time window in milliseconds (default: 60_000 = 1 minute)
 */
export function rateLimit(
  ip: string,
  limit: number,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  cleanup(ip, windowMs, now);

  const timestamps = store.get(ip) ?? [];
  if (timestamps.length >= limit) return false;

  timestamps.push(now);
  store.set(ip, timestamps);
  return true;
}

/** Extract client IP from request headers. */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0]?.trim() || "unknown";
}
