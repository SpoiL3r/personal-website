"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPinned } from "lucide-react";
import { useLocale } from "@/lib/contexts/LocaleContext";

const SESSION_FLAG = "visitor-registered";
const MAX_FLAGS = 5;

function normalizeCountries(codes: string[]) {
  return Array.from(
    new Set(
      codes
        .map((code) => code.trim().toUpperCase())
        .filter((code) => /^[A-Z]{2}$/.test(code)),
    ),
  ).sort();
}

export default function VisitorFlags() {
  const { locale, t } = useLocale();
  const [countries, setCountries] = useState<string[]>([]);

  const countryNames = useMemo(() => {
    if (typeof Intl === "undefined" || typeof Intl.DisplayNames === "undefined") return null;
    return new Intl.DisplayNames(locale, { type: "region" });
  }, [locale]);

  const visible = countries.slice(0, MAX_FLAGS);
  const hiddenCount = Math.max(0, countries.length - MAX_FLAGS);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const alreadyRegistered = sessionStorage.getItem(SESSION_FLAG) === "1";
        const response = await fetch("/api/visitors", {
          method: alreadyRegistered ? "GET" : "POST",
          cache: "no-store",
        });
        if (!response.ok) return;
        const body = (await response.json()) as { countries: string[] };
        if (cancelled) return;
        setCountries(normalizeCountries(body.countries ?? []));
        if (!alreadyRegistered) sessionStorage.setItem(SESSION_FLAG, "1");
      } catch {
        // silent fail
      }
    }
    void run();
    return () => { cancelled = true; };
  }, []);

  if (countries.length === 0) return null;

  return (
    <div
      aria-label="Visitor countries"
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        gap: "0.65rem",
        minWidth: "156px",
        padding: "0.75rem",
        borderRadius: "14px",
        background: "var(--bg-card)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <MapPinned size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />
        <span
          style={{
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--text-dim)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {t.visitors.label}
        </span>
        <span
          aria-hidden
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#3fb950",
            boxShadow: "0 0 5px rgba(63,185,80,0.7)",
            flexShrink: 0,
            animation: "pulse-dot 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Countries list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {visible.map((code) => (
          <div
            key={code}
            title={countryNames?.of(code) ?? code}
            aria-label={countryNames?.of(code) ?? code}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              minWidth: 0,
            }}
          >
            <span
              style={{
                minWidth: 28,
                height: 22,
                borderRadius: "7px",
                border: "1px solid var(--border)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: "color-mix(in srgb, var(--bg-hover) 72%, transparent)",
                fontSize: "0.68rem",
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "0.04em",
                padding: "0 0.35rem",
              }}
            >
              {code}
            </span>
            <span
              style={{
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "var(--text-muted)",
                fontSize: "0.72rem",
              lineHeight: 1,
              }}
            >
              {countryNames?.of(code) ?? code}
            </span>
          </div>
        ))}
        {hiddenCount > 0 && (
          <span
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono, monospace)",
              color: "var(--text-dim)",
              paddingTop: "0.15rem",
            }}
          >
            +{hiddenCount} {t.visitors.more}
          </span>
        )}
      </div>
    </div>
  );
}
