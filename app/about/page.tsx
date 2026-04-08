"use client";

import { useEffect, useMemo } from "react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import GamerSection from "@/components/sections/GamerSection";
import AboutHero from "@/components/about/AboutHero";
import { useTrophies } from "@/lib/contexts/TrophyContext";
import { useLocale } from "@/lib/contexts/LocaleContext";

export default function AboutPage() {
  const { unlock } = useTrophies();
  const { t } = useLocale();
  const funFactsData = useMemo(
    () => [
      { emoji: "☕", label: t.about.funFactFuelLabel, value: t.about.funFactFuelValue },
      { emoji: "🎮", label: t.about.funFactHobbyLabel, value: t.about.funFactHobbyValue },
      { emoji: "🌏", label: t.about.funFactLivedInLabel, value: t.about.funFactLivedInValue },
      { emoji: "🐛", label: t.about.funFactSideEffectLabel, value: t.about.funFactSideEffectValue },
    ],
    [
      t.about.funFactFuelLabel,
      t.about.funFactFuelValue,
      t.about.funFactHobbyLabel,
      t.about.funFactHobbyValue,
      t.about.funFactLivedInLabel,
      t.about.funFactLivedInValue,
      t.about.funFactSideEffectLabel,
      t.about.funFactSideEffectValue,
    ],
  );

  useEffect(() => {
    unlock("about_explorer");
  }, [unlock]);

  return (
    <div className="site-wrap section">
      <AboutHero />

      <hr className="divider" style={{ margin: "3rem 0" }} />

      <AnimateIn>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0.75rem",
            marginBottom: "2.5rem",
          }}
        >
          {funFactsData.map(({ emoji, label, value }) => (
            <div key={label} className="card" style={{ textAlign: "center", padding: "1.25rem 1rem" }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>{emoji}</div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.65rem",
                  fontFamily: "var(--font-mono, monospace)",
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.3rem",
                }}
              >
                {label}
              </p>
              <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{value}</p>
            </div>
          ))}
        </div>
      </AnimateIn>

      <hr className="divider" style={{ marginBottom: "2.5rem" }} />

      <AnimateIn>
        <GamerSection />
      </AnimateIn>

      <hr className="divider" style={{ margin: "2.5rem 0" }} />

      <AnimateIn>
        <p className="section-label">{t.about.education}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: "0.925rem", margin: 0 }}>{t.about.mastersSchool}</h3>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem" }}>{t.about.mastersDegree}</p>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  fontFamily: "var(--font-mono, monospace)",
                  flexShrink: 0,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                {t.about.mastersMeta}
              </p>
            </div>
          </div>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: "0.925rem", margin: 0 }}>{t.about.bachelorsSchool}</h3>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem" }}>{t.about.bachelorsDegree}</p>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  fontFamily: "var(--font-mono, monospace)",
                  flexShrink: 0,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                {t.about.bachelorsMeta}
              </p>
            </div>
          </div>
        </div>
      </AnimateIn>

      <hr className="divider" style={{ margin: "2.5rem 0" }} />

      <AnimateIn>
        <p className="section-label">{t.about.getInTouch}</p>
        <p style={{ maxWidth: "480px", lineHeight: 1.8 }}>
          {t.about.contactLead}{" "}
          <a href="mailto:think.vaibhavsingh@gmail.com" onClick={() => unlock("mail_sender")}>
            think.vaibhavsingh@gmail.com
          </a>
          {" "}{t.about.contactOrFind}{" "}
          <a href="https://linkedin.com/in/vaibhavcs" target="_blank" rel="noopener noreferrer" onClick={() => unlock("linkedin_stalker")}>
            {t.social.linkedin} ↗
          </a>
          . {t.about.getInTouchBody}
        </p>
      </AnimateIn>
    </div>
  );
}

