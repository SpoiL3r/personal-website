"use client";

import HomeHero from "@/components/home/HomeHero";
import AboutHero from "@/components/about/AboutHero";
import SystemKnowledge from "@/components/home/SystemKnowledge";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import ExtracurricularSection from "@/components/sections/ExtracurricularSection";
import ContactSection from "@/components/sections/ContactSection";
import Section from "@/components/sections/Section";
import { useLocale } from "@/lib/contexts/LocaleContext";

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="site-wrap">
      <section id="home" style={{ scrollMarginTop: "80px", paddingTop: "2rem" }}>
        <HomeHero />
      </section>

      <ExperienceSection />

      <Section
        id="about"
        title={t.sections.aboutTitle}
        subtitle={t.sections.aboutSubtitle}
      >
        <AboutHero compact />
        <div style={{ marginTop: "2rem" }}>
          <SystemKnowledge />
        </div>
      </Section>

      <EducationSection />
      <ExtracurricularSection />
      <ContactSection />
    </div>
  );
}
