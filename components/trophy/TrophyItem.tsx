import React from "react";
import { Check, Lock } from "lucide-react";
import type { Trophy } from "@/lib/data/trophies";
import type { Translations } from "@/lib/locales/types";

interface TrophyItemProps {
  trophy: Trophy;
  unlocked: boolean;
  t: Translations["trophies"];
}

export default function TrophyItem({ trophy, unlocked, t }: TrophyItemProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.65rem 1rem",
        opacity: unlocked ? 1 : 0.45,
        transition: "opacity 0.2s",
      }}
    >
      <span style={{ fontSize: "1.1rem", flexShrink: 0, lineHeight: 1.4 }}>
        {trophy.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: unlocked ? "var(--text)" : "var(--text-dim)",
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          {t[trophy.titleKey]}
          {unlocked && (
            <Check
              size={11}
              style={{ color: "#22c55e", flexShrink: 0 }}
            />
          )}
        </div>
        <div
          style={{
            fontSize: "0.7rem",
            color: "var(--text-dim)",
            fontFamily: "var(--font-mono, monospace)",
            marginTop: "0.1rem",
          }}
        >
          {t[trophy.descKey]}
        </div>
      </div>
      {!unlocked && (
        <Lock size={12} style={{ color: "var(--text-dim)", flexShrink: 0, marginTop: "3px" }} />
      )}
    </div>
  );
}
