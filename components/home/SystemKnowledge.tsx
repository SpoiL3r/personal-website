"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useTrophies } from "@/lib/contexts/TrophyContext";
import { CATEGORIES } from "@/lib/data/techStack";

export default function SystemKnowledge() {
  const { t } = useLocale();
  const { unlock } = useTrophies();
  const triggered = useRef(false);

  function handleHover() {
    if (!triggered.current) {
      triggered.current = true;
      unlock("tech_curious");
    }
  }

  return (
    <section
      style={{
        padding: "2rem 0 2.5rem",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        marginBottom: "2.5rem",
      }}
      onMouseEnter={handleHover}
    >
      {/* Section label */}
      <p
        className="section-label"
        style={{ marginBottom: "1.25rem" }}
      >
        {t.systemKnowledge.sectionLabel}
      </p>

      {/* 6-category grid */}
      <div className="knowledge-grid">
        {CATEGORIES.map(({ labelKey, icon: CatIcon, accent, items }, i) => (
          <motion.div
            key={labelKey}
            className="knowledge-category surface-info"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            style={{
              position: "relative",
              overflow: "hidden",
              ["--cat-accent" as string]: accent,
            }}
          >
            {/* Top gradient rail */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${accent}, ${accent}00)`,
              }}
            />
            {/* Category header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                marginBottom: "0.75rem",
                paddingBottom: "0.6rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  background: `${accent}1a`,
                  border: `1px solid ${accent}40`,
                  flexShrink: 0,
                }}
              >
                <CatIcon size={13} style={{ color: accent }} />
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-mono, monospace)",
                  color: "var(--text)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                }}
              >
                {t.systemKnowledge[labelKey]}
              </span>
            </div>

            {/* Tech items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {items.map(({ icon: techIcon, label }) => (
                <div
                  key={label}
                  className="tech-item"
                >
                  <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    {techIcon}
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
