"use client";

import React from "react";
import Section from "./Section";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import { EXPERIENCE } from "@/lib/data/experience";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useTrophies } from "@/lib/contexts/TrophyContext";

export default function ExperienceSection() {
  const { t } = useLocale();
  const { unlock } = useTrophies();

  return (
    <Section
      id="experience"
      title={t.sections.experienceTitle}
      subtitle={t.sections.experienceSubtitle}
    >
      <div
        className="hud-card surface-static"
        style={{
          background: "var(--bg-card)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "1.75rem",
        }}
      >
        <ExperienceTimeline jobs={EXPERIENCE} onComplete={() => unlock("exp_deep_dive")} />
      </div>
    </Section>
  );
}
