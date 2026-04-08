"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/contexts/LocaleContext";
import styles from "./HomeHero.module.css";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const up = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function HomeHero() {
  const { t } = useLocale();

  const badges: { icon?: string; text: string }[] = [
    { icon: "💼", text: `${t.hero.currentRole} @ ${t.hero.currentCompany}` },
    { icon: "📍", text: t.about.location },
  ];

  return (
    <section className={`${styles.hero} home-hero`}>
      <div aria-hidden className={styles.ambientGlow} />

      <div aria-hidden className={styles.dotGrid} />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className={styles.content}
      >
        <motion.h1 variants={up} className={styles.title}>
          {t.hero.greeting}{" "}
          <span className="shimmer-name">{t.about.fullName}</span>
        </motion.h1>

        <motion.div className={`${styles.badges} hero-badges`} variants={up}>
          {badges.map(({ icon, text }) => (
            <span key={text} className={styles.badge}>
              {icon && <span className={styles.badgeIcon}>{icon}</span>}
              {text}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
