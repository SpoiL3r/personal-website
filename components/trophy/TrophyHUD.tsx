"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence } from "framer-motion";
import { useTrophies } from "@/lib/contexts/TrophyContext";
import { useLocale } from "@/lib/contexts/LocaleContext";
import TrophyDropdown from "./TrophyDropdown";

const RING_R = 14;
const RING_CIRC = 2 * Math.PI * RING_R; // ~87.96

export default function TrophyHUD() {
  const { unlockedIds, progress, total } = useTrophies();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const pct = total > 0 ? progress / total : 0;
  const dash = RING_CIRC * pct;

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!mounted) return null;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label={t.trophies.hudLabel}
        title={t.trophies.hudLabel}
        className="trophy-hud-button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.55rem",
          padding: "0.2rem 0.75rem 0.2rem 0.3rem",
          height: "40px",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          background: open ? "var(--bg-card)" : "var(--bg-card)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          color: "var(--text-muted)",
          cursor: "pointer",
          boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 20px rgba(0,0,0,0.45), 0 0 0 1px var(--accent)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.35)";
        }}
      >
        {/* Circular progress ring with trophy */}
        <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
          <svg
            width="32"
            height="32"
            style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}
          >
            {/* Track */}
            <circle
              cx="16" cy="16" r={RING_R}
              fill="none"
              stroke="var(--border)"
              strokeWidth="2.5"
            />
            {/* Progress arc */}
            <circle
              cx="16" cy="16" r={RING_R}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${RING_CIRC}`}
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          </svg>
          {/* Trophy emoji centered in ring */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.9rem",
          }}>
            🏆
          </div>
        </div>

        {/* Count + label */}
        <div className="trophy-hud-meta" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}>
          <span style={{
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono, monospace)",
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "0.01em",
          }}>
            {progress}/{total}
          </span>
          <span style={{
            fontSize: "0.56rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--text-dim)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: "2px",
          }}>
            {t.trophies.countLabel}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <TrophyDropdown
            unlockedIds={unlockedIds}
            progress={progress}
            total={total}
            t={t.trophies}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
