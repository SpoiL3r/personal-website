"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPinned } from "lucide-react";
import { useLocale } from "@/lib/contexts/LocaleContext";

const SESSION_FLAG = "visitor-registered";
const MAX_FLAGS = 5;

function flagUrl(code: string) {
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
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
        setCountries(body.countries ?? []);
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
        gap: "0.5rem",
        padding: "0.6rem 0.7rem",
        borderRadius: "12px",
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

      {/* Flags row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        {visible.map((code) => (
          <span
            key={code}
            title={countryNames?.of(code) ?? code}
            style={{
              width: 20,
              height: 15,
              borderRadius: "3px",
              overflow: "hidden",
              border: "1px solid var(--border)",
              display: "inline-flex",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={flagUrl(code)}
              alt={countryNames?.of(code) ?? code}
              width={20}
              height={15}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </span>
        ))}
        {hiddenCount > 0 && (
          <span
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono, monospace)",
              color: "var(--text-dim)",
              marginLeft: "0.1rem",
            }}
          >
            +{hiddenCount}
          </span>
        )}
      </div>
    </div>
  );
}
