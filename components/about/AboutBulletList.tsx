"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/contexts/LocaleContext";
import styles from "./AboutHero.module.css";

const BOLD_TERMS = [
  "Java",
  "Spring Boot",
  "Apache Kafka",
  "Redis",
  "Kubernetes",
  "SAP Germany",
  "Bengaluru",
  "CS2",
  "Overwatch",
  "SDE 2",
  "6+",
  "3 years",
  "SDE 3",
];

const boldRegex = new RegExp(`(${BOLD_TERMS.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
const boldTerms = new Set(BOLD_TERMS);

function highlightBullet(text: string) {
  return text.split(boldRegex).map((part, i) =>
    boldTerms.has(part)
      ? <strong key={i} style={{ color: "var(--text)", fontWeight: 600 }}>{part}</strong>
      : part,
  );
}

export default function AboutBulletList() {
  const { t } = useLocale();
  const bullets = [t.about.bullet1, t.about.bullet2, t.about.bullet3, t.about.bullet4];

  return (
    <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} className={styles.bulletsSection}>
      <h2 className={styles.bulletsTitle}>{t.about.sectionLabel}</h2>
      <ul className={styles.bulletList}>
        {bullets.map((bullet, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + idx * 0.08 }}
            className={styles.bulletItem}
          >
            <span className={styles.bulletMarker}>•</span>
            <span>{highlightBullet(bullet)}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
