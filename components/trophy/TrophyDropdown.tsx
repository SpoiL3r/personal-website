import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TROPHIES } from "@/lib/data/trophies";
import TrophyItem from "./TrophyItem";
import { replayPlatinum } from "./PlatinumCelebration";
import type { Translations } from "@/lib/locales/types";

interface TrophyDropdownProps {
  unlockedIds: Set<string>;
  progress: number;
  total: number;
  t: Translations["trophies"];
}

export default function TrophyDropdown({
  unlockedIds,
  progress,
  total,
  t,
}: TrophyDropdownProps) {
  const pct = Math.round((progress / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: "280px",
        background: "var(--bg)",
        border: "1px solid var(--border-strong)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px var(--border)",
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "0.875rem 1rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--text-dim)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: 600,
          }}
        >
          {t.panelTitle}
        </span>
        <span
          style={{
            fontSize: "0.72rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--accent)",
            fontWeight: 600,
          }}
        >
          {progress} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "0.6rem 1rem", borderBottom: "1px solid var(--border)" }}>
        <div
          style={{
            height: "4px",
            borderRadius: "2px",
            background: "var(--bg-hover)",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, var(--accent), #a78bfa)",
              borderRadius: "2px",
            }}
          />
        </div>
        <p
          style={{
            margin: "0.3rem 0 0",
            fontSize: "0.62rem",
            color: "var(--text-dim)",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          {pct}% {t.progress.toLowerCase()}
        </p>
      </div>

      {/* Platinum replay — visible only after everything is unlocked */}
      {progress === total && total > 0 && (
        <button
          onClick={replayPlatinum}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.65rem 1rem",
            borderBottom: "1px solid var(--border)",
            border: "none",
            background: "linear-gradient(90deg, rgba(0,201,177,0.14), rgba(139,92,246,0.14))",
            color: "var(--text)",
            fontSize: "0.72rem",
            fontFamily: "var(--font-mono, monospace)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.18s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "linear-gradient(90deg, rgba(0,201,177,0.22), rgba(139,92,246,0.22))";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "linear-gradient(90deg, rgba(0,201,177,0.14), rgba(139,92,246,0.14))";
          }}
        >
          <Sparkles size={13} style={{ color: "#f59e0b" }} />
          {t.replayLabel}
        </button>
      )}

      {/* Trophy list */}
      <div
        style={{
          maxHeight: "320px",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {TROPHIES.map((trophy, idx) => (
          <div
            key={trophy.id}
            style={{
              borderBottom:
                idx < TROPHIES.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <TrophyItem
              trophy={trophy}
              unlocked={unlockedIds.has(trophy.id)}
              t={t}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
