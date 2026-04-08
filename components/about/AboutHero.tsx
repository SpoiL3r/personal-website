"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AboutBulletList from "./AboutBulletList";
import AboutIdentityHeader from "./AboutIdentityHeader";
import AboutMetaRow from "./AboutMetaRow";
import AboutSocialLinks from "./AboutSocialLinks";
import styles from "./AboutHero.module.css";

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

  async function copyDiscord() {
    try {
      await navigator.clipboard.writeText("spoilerfps");
      setDiscordCopied(true);
      window.setTimeout(() => setDiscordCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {!compact && (
        <motion.div variants={itemVariants} className={styles.logoWrap}>
          <div className={styles.logoBadge}>VS</div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className={styles.card}>
        <AboutIdentityHeader />
        <AboutMetaRow />
        <AboutSocialLinks discordCopied={discordCopied} onCopyDiscord={copyDiscord} />
      </motion.div>

      {!compact && <AboutBulletList />}
    </motion.div>
  );
}
