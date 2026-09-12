"use client";

import HomeHero from "@/components/home/HomeHero";
import SystemKnowledge from "@/components/home/SystemKnowledge";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HomeHero />
      <ExperienceSection />
      <SystemKnowledge />
      <EducationSection />
      <ContactSection />
    </>
  );
}
