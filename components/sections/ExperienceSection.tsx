"use client";

import React from "react";
import Section from "./Section";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import { EXPERIENCE } from "@/lib/data/experience";
import { useLocale } from "@/lib/contexts/LocaleContext";

export default function ExperienceSection() {
  const { t } = useLocale();

  return (
    <Section
      id="experience"
      label={t.nav.experience}
      title={t.sections.experienceTitle}
      subtitle={t.sections.experienceSubtitle}
    >
      <ExperienceTimeline jobs={EXPERIENCE} />
    </Section>
  );
}
