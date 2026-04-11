"use client";

import React from "react";
import { Joystick, HeartPulse } from "lucide-react";
import { GiPingPongBat, GiShuttlecock, GiSwimfins, GiWeightLiftingUp, GiChessKnight } from "react-icons/gi";
import Section from "./Section";
import GamingCard from "@/components/cards/GamingCard";
import ChessCard from "@/components/cards/ChessCard";
import CardHeader from "@/components/ui/CardHeader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useTrophies } from "@/lib/contexts/TrophyContext";
import { useLocale } from "@/lib/contexts/LocaleContext";

type ActivityKey = "swimming" | "tableTennis" | "gym" | "badminton";

const OFF_SCREEN: { key: ActivityKey; Icon: React.ElementType; color: string }[] = [
  // Grouped: fitness (swimming, gym) → racquet sports (table tennis, badminton)
  { key: "swimming",    Icon: GiSwimfins,        color: "#38bdf8" },
  { key: "gym",         Icon: GiWeightLiftingUp, color: "#a78bfa" },
  { key: "tableTennis", Icon: GiPingPongBat,     color: "#f97316" },
  { key: "badminton",   Icon: GiShuttlecock,     color: "#22c55e" },
];

const GLASS: React.CSSProperties = {
  background: "var(--bg-card)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
  overflow: "hidden",
};

export default function ExtracurricularSection() {
  const { unlock } = useTrophies();
  const { t } = useLocale();

  return (
    <Section
      id="extracurricular"
      title={t.sections.extracurricularTitle}
      subtitle={t.sections.extracurricularSubtitle}
    >
      <div className="games-grid hud-card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={GLASS} className="hud-card surface-static">
          <CardHeader label={t.extracurricular.gaming} Icon={Joystick} iconColor="#a78bfa" />
          <div style={{ padding: "1.25rem" }}>
            <ErrorBoundary>
              <GamingCard onLoaded={() => unlock("gaming_fan")} />
            </ErrorBoundary>
          </div>
        </div>

        <div style={GLASS} className="hud-card surface-static">
          <CardHeader label={t.extracurricular.chess} Icon={GiChessKnight} iconColor="#f59e0b" />
          <div style={{ padding: "1.25rem" }}>
            <ErrorBoundary>
              <ChessCard onLoaded={() => unlock("chess_fan")} />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Off-screen activities */}
      <div style={{ ...GLASS, marginTop: "1rem" }} className="hud-card surface-static">
        <CardHeader label={t.extracurricular.offScreen} Icon={HeartPulse} iconColor="#22c55e" />
        <div
          style={{
            padding: "1.1rem 1.25rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
          }}
        >
          {OFF_SCREEN.map(({ key, Icon, color }) => (
            <div
              key={key}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.5rem 0.85rem",
                borderRadius: "10px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text)",
                transition: "border-color 0.2s",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "7px",
                  background: `${color}1a`,
                  border: `1px solid ${color}55`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={14} color={color} strokeWidth={2.2} />
              </span>
              {t.extracurricular[key]}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
