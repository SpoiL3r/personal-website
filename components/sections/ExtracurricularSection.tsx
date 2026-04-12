"use client";

import React from "react";
import { Joystick, HeartPulse } from "lucide-react";
import { GiPingPongBat, GiShuttlecock, GiSwimfins, GiWeightLiftingUp, GiChessKnight } from "react-icons/gi";
import Section from "./Section";
import GamingCard from "@/components/cards/GamingCard";
import ChessCard from "@/components/cards/ChessCard";
import CardHeader from "@/components/ui/CardHeader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useLocale } from "@/lib/contexts/LocaleContext";

type ActivityKey = "swimming" | "tableTennis" | "gym" | "badminton";

const OFF_SCREEN: { key: ActivityKey; Icon: React.ElementType }[] = [
  { key: "swimming", Icon: GiSwimfins },
  { key: "gym", Icon: GiWeightLiftingUp },
  { key: "tableTennis", Icon: GiPingPongBat },
  { key: "badminton", Icon: GiShuttlecock },
];

const GLASS: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "18px",
  overflow: "hidden",
};

export default function ExtracurricularSection() {
  const { t } = useLocale();

  return (
    <Section
      id="extracurricular"
      title={t.sections.extracurricularTitle}
      subtitle={t.sections.extracurricularSubtitle}
    >
      <div className="games-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={GLASS} className="hud-card surface-static">
          <CardHeader label={t.extracurricular.gaming} Icon={Joystick} iconColor="var(--text-dim)" />
          <div style={{ padding: "1.25rem" }}>
            <ErrorBoundary>
              <GamingCard />
            </ErrorBoundary>
          </div>
        </div>

        <div style={GLASS} className="hud-card surface-static">
          <CardHeader label={t.extracurricular.chess} Icon={GiChessKnight} iconColor="var(--text-dim)" />
          <div style={{ padding: "1.25rem" }}>
            <ErrorBoundary>
              <ChessCard />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      <div style={{ ...GLASS, marginTop: "1rem" }} className="hud-card surface-static">
        <CardHeader label={t.extracurricular.offScreen} Icon={HeartPulse} iconColor="var(--text-dim)" />
        <div
          style={{
            padding: "1.1rem 1.25rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
          }}
        >
          {OFF_SCREEN.map(({ key, Icon }) => (
            <span
              key={key}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.35rem 0.75rem",
                borderRadius: "999px",
                background: "var(--bg-hover)",
                border: "1px solid var(--border)",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "var(--text-muted)",
              }}
            >
              <Icon size={14} color="var(--text-dim)" />
              {t.extracurricular[key]}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
