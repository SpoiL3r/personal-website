"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap } from "lucide-react";
import Section from "./Section";
import Tag from "@/components/ui/Tag";
import LocationFlag from "@/components/ui/LocationFlag";
import { EDUCATION } from "@/lib/data/experience";
import { useLocale } from "@/lib/contexts/LocaleContext";

export default function EducationSection() {
  const { t } = useLocale();
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <Section
      id="education"
      title={t.sections.educationTitle}
      subtitle={t.sections.educationSubtitle}
    >
      <div
        className="hud-card"
        style={{
          background: "var(--bg-card)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {EDUCATION.map((edu, idx) => (
          <motion.div
            key={edu.company}
            className="edu-row"
            onHoverStart={() => setHovered(edu.company)}
            onHoverEnd={() => setHovered(h => (h === edu.company ? null : h))}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: idx * 0.1, ease: "easeOut" }}
            style={{
              display: "flex",
              gap: "1rem",
              padding: "1.25rem 1.4rem",
              borderBottom: idx < EDUCATION.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "flex-start",
              ["--row-accent" as string]: edu.accent ?? "var(--accent)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                background: "#ffffff",
                border: `2px solid ${edu.accent ?? "var(--accent)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 4px 16px ${edu.accent ?? "var(--accent)"}33`,
                overflow: "hidden",
                padding: "4px",
              }}
            >
              {edu.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={edu.logo}
                  alt={`${edu.company} logo`}
                  width={32}
                  height={32}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <GraduationCap size={18} color={edu.accent ?? "var(--accent)"} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  alignItems: "baseline",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {edu.company}
                </h3>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-mono, monospace)",
                    color: edu.accent ?? "var(--accent)",
                  }}
                >
                  {edu.period}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                  marginTop: "0.3rem",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.55,
                    flex: "1 1 260px",
                  }}
                >
                  {edu.role}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.72rem",
                    color: "var(--text-dim)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    textAlign: "right",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  <LocationFlag location={edu.location} />
                  {edu.location}
                </p>
              </div>
              {edu.tags && edu.tags.length > 0 && (
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.6rem", minHeight: "1.5rem" }}>
                  <AnimatePresence>
                    {hovered === edu.company &&
                      edu.tags.map((tag, ti) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.25, delay: ti * 0.04, ease: [0.16, 1, 0.3, 1] as const }}
                        >
                          <Tag label={tag} color={edu.accent} />
                        </motion.span>
                      ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
