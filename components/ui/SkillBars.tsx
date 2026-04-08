"use client";

import { motion } from "framer-motion";

const skills = [
  { name: "Java 21",      level: 90, color: "#f89820" },
  { name: "Spring Boot",  level: 88, color: "#6db33f" },
  { name: "REST / OData", level: 86, color: "#58a6ff" },
  { name: "Microservices",level: 82, color: "#a371f7" },
  { name: "MySQL",        level: 80, color: "#4479a1" },
  { name: "Docker",       level: 72, color: "#2496ed" },
  { name: "Apache Kafka", level: 68, color: "#ff6b35" },
  { name: "Redis",        level: 66, color: "#dc382d" },
];

function levelLabel(pct: number) {
  if (pct >= 88) return "Expert";
  if (pct >= 75) return "Advanced";
  if (pct >= 60) return "Proficient";
  return "Familiar";
}

export default function SkillBars() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {skills.map((skill, idx) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: idx * 0.06, ease: "easeOut" }}
        >
          {/* Label row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "0.3rem",
            }}
          >
            <span
              style={{
                fontSize: "0.82rem",
                fontFamily: "var(--font-mono, monospace)",
                color: "var(--text-muted)",
              }}
            >
              {skill.name}
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                fontFamily: "var(--font-mono, monospace)",
                color: skill.color,
                opacity: 0.85,
                letterSpacing: "0.06em",
              }}
            >
              {levelLabel(skill.level)}
            </span>
          </div>

          {/* Track */}
          <div
            style={{
              height: "5px",
              background: "var(--bg-hover)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, delay: idx * 0.06 + 0.1, ease: "easeOut" }}
              style={{
                height: "100%",
                borderRadius: "3px",
                background: `linear-gradient(90deg, ${skill.color}99, ${skill.color})`,
                boxShadow: `0 0 8px ${skill.color}55`,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
