"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import { EXPERIENCE } from "@/lib/data/experience";
import { useTrophies } from "@/lib/contexts/TrophyContext";
import { useLocale } from "@/lib/contexts/LocaleContext";

export default function ExperiencePage() {
  const { unlock } = useTrophies();
  const { t } = useLocale();

  return (
    <div className="site-wrap section">
      <AnimateIn>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{t.experience.pageTitle}</h1>
        <p style={{ marginBottom: "2rem", maxWidth: "480px" }}>{t.experience.pageSubtitle}</p>
      </AnimateIn>
      <ExperienceTimeline jobs={EXPERIENCE} onComplete={() => unlock("exp_deep_dive")} />
    </div>
  );
}
