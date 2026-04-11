"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import AboutBulletList from "./AboutBulletList";
import AboutSocialLinks from "./AboutSocialLinks";
import styles from "./AboutHero.module.css";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useTrophies } from "@/lib/contexts/TrophyContext";
import { GITHUB_AVATAR_URL } from "@/lib/constants/profile";

interface Props {
  compact?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function AboutHero({ compact = false }: Props) {
  const [discordCopied, setDiscordCopied] = useState(false);
  const { t } = useLocale();
  const { unlock } = useTrophies();
  const aboutSeenRef = useRef(false);

  async function copyDiscord() {
    try {
      await navigator.clipboard.writeText("spoilerfps");
      setDiscordCopied(true);
      window.setTimeout(() => setDiscordCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  function handleViewportEnter() {
    if (aboutSeenRef.current) return;
    aboutSeenRef.current = true;
    unlock("about_explorer");
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      onViewportEnter={handleViewportEnter}
    >
      {compact ? (
        <div className={styles.compactShell}>
          <motion.div variants={itemVariants} className={styles.compactIntro}>
            <div className={styles.compactHeader}>
              <div className={styles.compactMark}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={GITHUB_AVATAR_URL}
                  alt={t.about.fullName}
                  className={styles.profileImage}
                  referrerPolicy="no-referrer"
                />
                <span className={styles.profileFallback} aria-hidden>VS</span>
              </div>
              <div className={styles.compactIdentity}>
                <p className={styles.compactKicker}>
                  {t.hero.currentRole} | {t.hero.currentCompany}
                </p>
                <h3 className={styles.compactTitle}>{t.about.fullName}</h3>
              </div>
            </div>

            <p className={styles.compactLead}>{t.about.tagline}</p>

            <div className={styles.compactTagRow}>
              <span className={styles.compactTag}>{t.status.experience}</span>
              <span className={styles.compactTag}>{t.about.location}</span>
              <span className={styles.compactTag}>
                {t.languages.english} | {t.languages.hindi} | {t.languages.german}
              </span>
              <span className={styles.compactTag}>Java | Spring Boot | APIs</span>
            </div>

            <AboutSocialLinks
              compact
              discordCopied={discordCopied}
              onCopyDiscord={copyDiscord}
            />
          </motion.div>

          <motion.div variants={itemVariants} className={styles.compactNarrative}>
            <AboutBulletList compact />
          </motion.div>
        </div>
      ) : (
        <>
          <motion.div variants={itemVariants} className={styles.logoWrap}>
            <div className={styles.logoBadge}>VS</div>
          </motion.div>

          <motion.div variants={itemVariants} className={styles.card}>
            <div className={styles.headerRow}>
              <div className={styles.avatarWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={GITHUB_AVATAR_URL}
                  alt={t.about.fullName}
                  className={styles.profileImage}
                  referrerPolicy="no-referrer"
                />
                <div className={styles.avatarMonogram} aria-hidden>VS</div>
              </div>
              <div className={styles.identityBlock}>
                <div className={styles.nameRow}>
                  <span className={styles.name}>{t.about.fullName}</span>
                </div>
                <p className={styles.tagline}>{t.about.tagline}</p>
              </div>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>{t.status.experience}</span>
              <span className={styles.metaItem}>{t.about.location}</span>
              <span className={styles.metaItem}>{t.hero.currentCompany}</span>
            </div>
            <AboutSocialLinks discordCopied={discordCopied} onCopyDiscord={copyDiscord} />
          </motion.div>

          <AboutBulletList />
        </>
      )}
    </motion.div>
  );
}
