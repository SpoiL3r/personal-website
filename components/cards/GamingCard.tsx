"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaSteam } from "react-icons/fa";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useTheme } from "@/components/layout/ThemeProvider";

interface Game {
  name: string;
  short: string;
  color: string;
  hours: number;
  iconUrl?: string;
}

const TIERS_DARK = [
  { min: 2000, color: "#f2f3f5", glow: "rgba(242, 243, 245, 0.35)" },
  { min: 500,  color: "#c3c8cf", glow: "rgba(195, 200, 207, 0.3)" },
  { min: 100,  color: "#9aa1aa", glow: "rgba(154, 161, 170, 0.26)" },
  { min: 0,    color: "#6f737a", glow: "rgba(111, 115, 122, 0.24)" },
];

const TIERS_LIGHT = [
  { min: 2000, color: "#0550ae", glow: "rgba(5, 80, 174, 0.3)" },
  { min: 500,  color: "#0969da", glow: "rgba(9, 105, 218, 0.25)" },
  { min: 100,  color: "#218bff", glow: "rgba(33, 139, 255, 0.2)" },
  { min: 0,    color: "#59636e", glow: "rgba(89, 99, 110, 0.18)" },
];

function tierFor(hours: number, t: ReturnType<typeof useLocale>["t"], isDark: boolean) {
  const tiers = isDark ? TIERS_DARK : TIERS_LIGHT;
  const labels = [
    t.extracurricular.tierObsessed,
    t.extracurricular.tierDedicated,
    t.extracurricular.tierRegular,
    t.extracurricular.tierCasual,
  ];
  const idx = tiers.findIndex((tier) => hours >= tier.min);
  const tier = tiers[idx];
  return { color: tier.color, glow: tier.glow, label: labels[idx] };
}

export default function GamingCard() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/gaming-stats", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setGames(data.games ?? []);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setLoading(false);
        setError(true);
      });
    return () => controller.abort();
  }, []);

  const maxHours = Math.max(...games.map((g) => g.hours), 1);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div
              style={{
                height: "0.875rem",
                width: i === 1 ? "60%" : i === 2 ? "45%" : "30%",
                background: "var(--bg-hover)",
                borderRadius: "4px",
                animation: "pulse-skeleton 1.5s ease-in-out infinite",
              }}
            />
            <div style={{ height: "3px", background: "var(--bg-hover)", borderRadius: "2px" }} />
          </div>
        ))}
      </div>
    );
  }

  if (!loading && error) {
    return (
      <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "var(--text-dim)" }}>
        {t.extracurricular.failedToLoadStats}
      </p>
    );
  }

  if (games.length === 0) {
    return (
      <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "var(--text-dim)" }}>
        {t.extracurricular.failedToLoadStats}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {games.map(({ name, short, hours, iconUrl }) => {
        const tier = tierFor(hours, t, isDark);
        return (
          <div key={name}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.3rem",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                {iconUrl && (
                  <Image
                    src={iconUrl}
                    alt={`${name} icon`}
                    width={20}
                    height={20}
                    style={{
                      borderRadius: "4px",
                      objectFit: "cover",
                      flexShrink: 0,
                      border: "1px solid var(--border)",
                    }}
                  />
                )}
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{short}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.55rem",
                    fontFamily: "var(--font-mono, monospace)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: tier.color,
                    background: `${tier.color}1a`,
                    border: `1px solid ${tier.color}55`,
                    padding: "0.05rem 0.4rem",
                    borderRadius: "10px",
                  }}
                >
                  {tier.label}
                </span>
                <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: tier.color }}>
                  {hours.toLocaleString()}h
                </span>
              </div>
            </div>
            <div style={{ height: "4px", background: "var(--bg-hover)", borderRadius: "2px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.round((hours / maxHours) * 100)}%`,
                  borderRadius: "2px",
                  background: tier.color,
                  boxShadow: `0 0 10px ${tier.glow}`,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.68rem", color: "var(--text-dim)" }}>{name}</p>
          </div>
        );
      })}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "0.85rem",
          paddingTop: "0.7rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "var(--accent)",
            animation: "pulse-dot 2s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        <FaSteam size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />
        <span
          style={{
            fontSize: "0.62rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--text-dim)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {t.extracurricular.liveFromSteam} · {t.extracurricular.updatedDaily}
        </span>
      </div>
    </div>
  );
}
