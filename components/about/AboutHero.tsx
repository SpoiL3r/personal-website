"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AboutBulletList from "./AboutBulletList";
import styles from "./AboutHero.module.css";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { GITHUB_AVATAR_URL } from "@/lib/constants/profile";

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function AboutHero() {
  const { t } = useLocale();

  return (
    <motion.div
      className={styles.card}
      variants={fade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className={styles.top}>
        <div className={styles.photoWrap}>
          <Image
            src={GITHUB_AVATAR_URL}
            alt={t.about.fullName}
            width={88}
            height={88}
            className={styles.photo}
            referrerPolicy="no-referrer"
          />
        </div>
        <p className={styles.tagline}>{t.about.tagline}</p>
      </div>

      <div className={styles.divider} />

      <AboutBulletList compact />
    </motion.div>
  );
}
