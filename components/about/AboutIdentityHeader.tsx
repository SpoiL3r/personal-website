"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";
import styles from "./AboutHero.module.css";

const STEAM_AVATAR =
  "https://avatars.steamstatic.com/6f07fc5ce9e7979b0b5293ac501375936fbe7610_full.jpg";

type LanguageEntry = {
  name: string;
  level: string;
  flag: "GB" | "IN" | "DE";
  color: string;
  dots: number;
};

function PronounceButton() {
  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Vaibhav Singh");
    utterance.lang = "en-IN";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      onClick={speak}
      aria-label="Pronounce name"
      title="Hear pronunciation"
      className={styles.pronounceButton}
      type="button"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
      </svg>
    </button>
  );
}

function FlagIcon({ flag }: { flag: LanguageEntry["flag"] }) {
  if (flag === "GB") {
    return (
      <svg viewBox="0 0 60 40" width="20" height="14">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
        <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    );
  }

  if (flag === "IN") {
    return (
      <svg viewBox="0 0 60 40" width="20" height="14">
        <rect width="60" height="13.33" y="0" fill="#FF9933" />
        <rect width="60" height="13.34" y="13.33" fill="#FFFFFF" />
        <rect width="60" height="13.33" y="26.67" fill="#138808" />
        <circle cx="30" cy="20" r="4" fill="none" stroke="#000080" strokeWidth="0.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 40" width="20" height="14">
      <rect width="60" height="13.33" y="0" fill="#000000" />
      <rect width="60" height="13.34" y="13.33" fill="#DD0000" />
      <rect width="60" height="13.33" y="26.67" fill="#FFCE00" />
    </svg>
  );
}

function LanguageList({ languages }: { languages: LanguageEntry[] }) {
  const { t } = useLocale();

  return (
    <div className={`${styles.languages} about-languages`}>
      <span className={styles.languagesLabel}>{t.languages.sectionLabel}</span>
      {languages.map(({ name, level, flag, color, dots }) => (
        <div key={name} title={level} className={styles.languageRow}>
          <span aria-hidden className={styles.flagWrap}>
            <FlagIcon flag={flag} />
          </span>
          <span className={styles.languageName}>{name}</span>
          <span aria-hidden className={styles.languageDots}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={styles.languageDot}
                style={{
                  background: i < dots ? color : "var(--bg-hover)",
                  boxShadow: i < dots ? `0 0 3px ${color}aa` : "none",
                }}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AboutIdentityHeader() {
  const { t } = useLocale();
  const languages: LanguageEntry[] = [
    { name: t.languages.english, level: t.languages.levelFullProfessional, flag: "GB", color: "#00c9b1", dots: 5 },
    { name: t.languages.hindi, level: t.languages.levelNative, flag: "IN", color: "#f59e0b", dots: 5 },
    { name: t.languages.german, level: t.languages.levelLimitedWorking, flag: "DE", color: "#a78bfa", dots: 2 },
  ];

  return (
    <div className={`${styles.headerRow} about-header-row`}>
      <div className={styles.avatarWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STEAM_AVATAR} alt={t.about.fullName} width={72} height={72} style={{ display: "block" }} />
      </div>

      <div className={styles.identityBlock}>
        <div className={styles.nameRow}>
          <span className={`${styles.name} hero-gradient-name`}>{t.about.fullName}</span>
          <PronounceButton />
        </div>
        <p className={styles.tagline}>{t.about.tagline}</p>
      </div>

      <LanguageList languages={languages} />
    </div>
  );
}
