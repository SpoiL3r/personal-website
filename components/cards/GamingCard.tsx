"use client";

import { useEffect, useState } from "react";
import { FaSteam } from "react-icons/fa";
import { useLocale } from "@/lib/contexts/LocaleContext";

interface Game {
  name: string;
  short: string;
  color: string;
  hours: number;
  iconUrl?: string;
}

interface Props { onLoaded?: () => void; }

export default function GamingCard({ onLoaded }: Props) {
  const { t } = useLocale();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/gaming-stats")
      .then((r) => r.json())
      .then((data) => {
        setGames(data.games ?? []);
        setLoading(false);
        onLoaded?.();
      })
      .catch(() => { setLoading(false); setError(true); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxHours = Math.max(...games.map((g) => g.hours), 1);

  // Colour-code the bar by hours tier (casual → obsessed)
  function tierFor(hours: number) {
    if (hours >= 2000) return { color: "#ef4444", label: t.extracurricular.tierObsessed };
    if (hours >= 500)  return { color: "#f59e0b", label: t.extracurricular.tierDedicated };
    if (hours >= 100)  return { color: "#3b82f6", label: t.extracurricular.tierRegular };
    return { color: "#22c55e", label: t.extracurricular.tierCasual };
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{
              height: "0.875rem", width: i === 1 ? "60%" : i === 2 ? "45%" : "30%",
              background: "var(--bg-hover)", borderRadius: "4px",
              animation: "pulse-skeleton 1.5s ease-in-out infinite",
            }} />
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
        const tier = tierFor(hours);
        return (
          <div key={name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                {iconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={iconUrl}
                    alt={`${name} icon`}
                    width={20}
                    height={20}
                    style={{
                      width: 20,
                      height: 20,
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
                <span style={{
                  fontSize: "0.55rem",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: tier.color,
                  background: `${tier.color}1a`,
                  border: `1px solid ${tier.color}55`,
                  padding: "0.05rem 0.4rem",
                  borderRadius: "10px",
                }}>
                  {tier.label}
                </span>
                <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: tier.color }}>
                  {hours.toLocaleString()}h
                </span>
              </div>
            </div>
            <div style={{ height: "4px", background: "var(--bg-hover)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.round((hours / maxHours) * 100)}%`,
                borderRadius: "2px",
                background: tier.color,
                boxShadow: `0 0 8px ${tier.color}99`,
                transition: "width 0.6s ease",
              }} />
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
            backgroundColor: "#3fb950",
            animation: "pulse-dot 2s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        <FaSteam size={12} style={{ color: "#3fb950", flexShrink: 0 }} />
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

