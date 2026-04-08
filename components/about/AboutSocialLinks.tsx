"use client";

import type { ElementType } from "react";
import { ArrowUpRight } from "lucide-react";
import { FaDiscord, FaGithub, FaLinkedin, FaSteam } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useTrophies } from "@/lib/contexts/TrophyContext";
import styles from "./AboutHero.module.css";

type SocialEntry = {
  icon: ElementType;
  label: string;
  href: string | null;
  bg: string;
  color: string;
  trophyId: string | null;
  onClick?: () => void;
};

export default function AboutSocialLinks({
  discordCopied,
  onCopyDiscord,
}: {
  discordCopied: boolean;
  onCopyDiscord: () => void;
}) {
  const { unlock } = useTrophies();
  const { t } = useLocale();

  const socials: SocialEntry[] = [
    { icon: FaXTwitter, label: t.social.x, href: "https://x.com/vaibhav_think", bg: "#000000", color: "#e7e9ea", trophyId: null },
    { icon: FaGithub, label: t.social.github, href: "https://github.com/SpoiL3r", bg: "#24292e", color: "#ffffff", trophyId: "github_hunter" },
    { icon: FaLinkedin, label: t.social.linkedin, href: "https://linkedin.com/in/vaibhavcs", bg: "#0077b5", color: "#ffffff", trophyId: "linkedin_stalker" },
    { icon: FaSteam, label: t.social.steam, href: "https://steamcommunity.com/id/spoilerfps", bg: "#1b2838", color: "#66c0f4", trophyId: "gaming_fan" },
    { icon: FaDiscord, label: discordCopied ? t.social.copied : t.social.discord, href: null, bg: "#5865f2", color: "#ffffff", trophyId: null, onClick: onCopyDiscord },
  ];

  return (
    <div className={styles.socialRow}>
      {socials.map(({ icon: Icon, label, href, bg, color, trophyId, onClick }) => {
        const pill = (
          <div className={styles.socialPill}>
            <span className={styles.socialIconWrap} style={{ background: bg }}>
              <Icon style={{ color, fontSize: "0.8rem" }} />
            </span>
            <span className={styles.socialLabel}>{label}</span>
            {href && <ArrowUpRight size={12} style={{ color: "var(--text-dim)" }} />}
          </div>
        );

        if (href) {
          return (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              onClick={() => trophyId && unlock(trophyId)}
            >
              {pill}
            </a>
          );
        }

        return (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className={styles.socialButton}
          >
            {pill}
          </button>
        );
      })}
    </div>
  );
}
