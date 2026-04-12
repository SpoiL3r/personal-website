"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { CATEGORIES } from "@/lib/data/techStack";

export default function SystemKnowledge() {
  const { t } = useLocale();

  return (
    <section style={{ paddingTop: "1rem" }}>
      <p className="section-label" style={{ marginBottom: "0.85rem" }}>
        {t.systemKnowledge.sectionLabel}
      </p>

      <div className="sk-grid">
        {CATEGORIES.map(({ labelKey, icon: CatIcon, accent, items }, i) => (
          <motion.div
            key={labelKey}
            className="sk-card"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: "easeOut" }}
          >
            <div className="sk-header">
              <CatIcon size={13} style={{ color: accent }} />
              <span className="sk-label">
                {t.systemKnowledge[labelKey]}
              </span>
            </div>
            <div className="sk-items">
              {items.map(({ label }) => (
                <span key={label} className="sk-chip">{label}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
