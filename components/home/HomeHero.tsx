"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Download,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useTrophies } from "@/lib/contexts/TrophyContext";
import styles from "./HomeHero.module.css";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const up = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function HomeHero() {
  const { t } = useLocale();
  const { unlock } = useTrophies();

  const badges = [
    { icon: Sparkles, text: t.hero.availableBadge },
    { icon: BriefcaseBusiness, text: `${t.hero.currentRole} @ ${t.hero.currentCompany}` },
    { icon: MapPin, text: t.about.location },
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
        <motion.div variants={up} className={styles.eyebrow}>
          <span>{t.hero.subtitle}</span>
        </motion.div>

        <motion.h1 variants={up} className={styles.title}>
          {t.about.fullName}
        </motion.h1>

        <motion.p variants={up} className={styles.roleLine}>
          {t.hero.roleLine}
        </motion.p>

        <motion.div variants={up} className={styles.actions}>
          <Link href="/#experience" className="btn btn-primary">
            {t.nav.experience}
          </Link>
          <Link href="/#contact" className="btn btn-outline">
            <Mail size={15} />
            {t.contact.emailMe}
          </Link>
          <a
            href="/vaibhav_singh_cv.pdf"
            download="Vaibhav_Singh_Resume.pdf"
            className="btn btn-outline"
            onClick={() => unlock("resume_downloader")}
          >
            <Download size={15} />
            {t.contact.downloadResume}
          </a>
        </motion.div>

        <motion.div className={`${styles.badges} hero-badges`} variants={up}>
          {badges.map(({ icon: Icon, text }) => (
            <span key={text} className={styles.badge}>
              <span className={styles.badgeIcon}>
                <Icon size={14} />
              </span>
              {text}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
