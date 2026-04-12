"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/contexts/LocaleContext";
import styles from "./AboutHero.module.css";

export default function AboutBulletList({ compact = false }: { compact?: boolean }) {
  const { t } = useLocale();
  const bullets = [t.about.bullet1, t.about.bullet2, t.about.bullet3, t.about.bullet4];

  return (
    <motion.div
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      className={styles.bulletsSection}
    >
      <ul className={compact ? styles.compactBulletList : styles.bulletList}>
        {bullets.map((bullet, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + idx * 0.08 }}
            className={compact ? styles.compactBulletItem : styles.bulletItem}
          >
            <span className={styles.bulletMarker}>{"\u2022"}</span>
            <span>{bullet}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
