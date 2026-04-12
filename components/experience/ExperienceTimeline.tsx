"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Tag from "@/components/ui/Tag";
import LocationFlag from "@/components/ui/LocationFlag";
import type { Job } from "@/lib/data/experience";

interface ExperienceTimelineProps {
  jobs: Job[];
  onComplete?: () => void;
}

export default function ExperienceTimeline({ jobs, onComplete }: ExperienceTimelineProps) {
  const hasCompleted = useRef(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {jobs.map((exp, idx) => (
        <motion.div
          key={exp.company}
          className="exp-row"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          onViewportEnter={() => {
            if (idx !== jobs.length - 1 || hasCompleted.current) return;
            hasCompleted.current = true;
            onComplete?.();
          }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay: idx * 0.08 }}
          style={{
            display: "flex",
            gap: "1.5rem",
            paddingBottom: idx === jobs.length - 1 ? 0 : "2.5rem",
            ["--row-accent" as string]: exp.accent ?? "var(--accent)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: "44px" }}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ rotate: 6, scale: 1.08 }}
              transition={{ duration: 0.35, delay: idx * 0.08 + 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "#ffffff",
                border: `2px solid ${exp.accent ?? "var(--accent)"}`,
                boxShadow: `0 4px 16px ${exp.accent ?? "rgba(0,201,177,0.4)"}33`,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: "4px",
              }}
            >
              {exp.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  width={32}
                  height={32}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: exp.accent ?? "var(--accent)",
                  }}
                >
                  {exp.company.charAt(0)}
                </span>
              )}
            </motion.div>
            {idx !== jobs.length - 1 && (
              <motion.div
                initial={{ scaleY: 0, originY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 + 0.25, ease: "easeOut" }}
                style={{
                  width: "1px",
                  flex: 1,
                  background: `linear-gradient(to bottom, ${exp.accent ?? "var(--accent)"}, var(--border))`,
                  marginTop: "8px",
                  transformOrigin: "top",
                }}
              />
            )}
          </div>

          <div style={{ flex: 1, paddingBottom: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1rem", margin: 0 }}>{exp.company}</h2>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.825rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {exp.role}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: "0.775rem", color: exp.accent ?? "var(--accent)", fontFamily: "var(--font-mono, monospace)" }}>
                  {exp.period}
                </p>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.775rem", color: "var(--text-dim)", display: "inline-flex", alignItems: "center" }}>
                  <LocationFlag location={exp.location} />
                  {exp.location}
                </p>
              </div>
            </div>

            {exp.highlights && exp.highlights.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: "0.75rem 0 0", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {exp.highlights.map((h, hi) => (
                  <li key={hi} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.825rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                    <span style={{ color: exp.accent ?? "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem" }}>
                      {"\u2022"}
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {exp.tags && exp.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.75rem", minHeight: "1.5rem" }}>
                {exp.tags.map((tag, ti) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: ti * 0.04, ease: [0.16, 1, 0.3, 1] as const }}
                  >
                    <Tag label={tag} color={exp.accent} />
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
