/**
 * GamerSection — "Off the clock / Gaming" subsection.
 *
 * Data flow:
 *   1. On mount, fetches /api/gaming-stats (server route that calls the Steam API).
 *   2. The `games` array is populated from data.games; on error it stays empty
 *      and no game cards are rendered (silent failure — the socials still show).
 *
 * Layout:
 *   - Social handles (Steam, Discord, X) are rendered as animated pill links.
 *     Discord has no public profile URL so its pill is non-interactive (no <a>).
 *   - Game cards are sourced from the Steam API and enriched with a local
 *     `gameMeta` lookup (genre label, active flag). Unknown games fall back to
 *     a generic genre label.
 *   - Each card shows a pulsing green "active" dot when gameMeta.active is true.
 */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSteam, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useLocale } from "@/lib/contexts/LocaleContext";

/** A single game entry as returned by /api/gaming-stats. */
interface Game {
  /** Full Steam game title (used as the gameMeta lookup key). */
  name: string;
  /** Shortened display name shown on the card. */
  short: string;
  /** Accent hex colour for the card top-border and hours label. */
  color: string;
  /** Total hours played on Steam (already rounded by the API). */
  hours: number;
}

/** Renders the gaming identity section: social handles + Steam top-games cards. */
export default function GamerSection() {
  const { t } = useLocale();
  const [games, setGames] = useState<Game[]>([]);

  // Social links config. href: null means display-only (no hyperlink rendered).
  const socials = [
    {
      icon: FaSteam,
      label: t.social.steam,
      handle: "SpoiL3r",
      href: "https://steamcommunity.com/profiles/76561198150360642",
      color: "#c6d4df",
    },
    {
      icon: FaDiscord,
      label: t.social.discord,
      handle: "spoilerfps",
      href: null,
      color: "#5865f2",
    },
    {
      icon: FaXTwitter,
      label: t.social.twitterX,
      handle: "@vaibhav_think",
      href: "https://x.com/vaibhav_think",
      color: "#e7e9ea",
    },
  ];

  // Static metadata for known games. Games returned by the API that are not
  // listed here fall back to { genre: genreGeneric, active: true } at render time.
  const gameMeta: Record<string, { genre: string; active: boolean }> = {
    "Counter-Strike 2": { genre: t.extracurricular.tacticalFps, active: true },
    "PUBG: BATTLEGROUNDS": { genre: t.extracurricular.battleRoyale, active: true },
    "Overwatch 2": { genre: t.extracurricular.heroShooter, active: true },
  };

  // Fetch Steam playtime data once on mount. On error the games array stays
  // empty and no game cards are rendered — socials section is unaffected.
  useEffect(() => {
    fetch("/api/gaming-stats")
      .then((r) => r.json())
      .then((data) => setGames(data.games ?? []))
      .catch(() => {});
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <span style={{
          width: "3px", height: "14px", borderRadius: "2px",
          background: "var(--accent)", display: "inline-block", flexShrink: 0, opacity: 0.8,
        }} />
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.67rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            fontWeight: 600,
          }}
        >
          {t.extracurricular.gaming}
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(to right, var(--border), transparent)",
          }}
        />
      </div>

      {/* Socials */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          marginBottom: "1.75rem",
        }}
      >
        {socials.map(({ icon: Icon, label, handle, href, color }, idx) => {
          const content = (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.35, ease: "easeOut" }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.65rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.6rem 1rem",
                transition: "border-color 0.2s, box-shadow 0.2s",
                cursor: href ? "pointer" : "default",
                textDecoration: "none",
              }}
              whileHover={
                href
                  ? {
                      borderColor: color,
                      boxShadow: `0 0 12px ${color}30`,
                    }
                  : {}
              }
            >
              <Icon style={{ color, fontSize: "1.1rem", flexShrink: 0 }} />
              <div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-dim)",
                    fontFamily: "var(--font-mono, monospace)",
                    display: "block",
                    lineHeight: 1,
                    marginBottom: "0.15rem",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {handle}
                </span>
              </div>
            </motion.div>
          );

          return href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", display: "block" }}
            >
              {content}
            </a>
          ) : (
            <div key={label}>{content}</div>
          );
        })}
      </div>

      {/* Games */}
      <p
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.7rem",
          color: "var(--text-dim)",
          letterSpacing: "0.08em",
          marginBottom: "0.875rem",
        }}
      >
        {t.extracurricular.currentlyPlaying.toUpperCase()}
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {games.map(({ name, short, color, hours }, idx) => {
          const meta = gameMeta[name] ?? { genre: t.extracurricular.genreGeneric, active: true };
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.35, ease: "easeOut" }}
              whileHover={{ y: -3, boxShadow: `0 8px 24px ${color}30` }}
              style={{
                background: "var(--bg-card)",
                border: `1px solid ${color}55`,
                borderTop: `2px solid ${color}`,
                borderRadius: "8px",
                padding: "0.85rem 1.1rem",
                minWidth: "130px",
                transition: "border-color 0.2s",
                cursor: "default",
              }}
            >
              {meta.active && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.5rem" }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    backgroundColor: "#3fb950", display: "inline-block",
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }} />
                  <span style={{
                    fontSize: "0.62rem", fontFamily: "var(--font-mono, monospace)",
                    color: "#3fb950", letterSpacing: "0.08em",
                  }}>
                    {t.extracurricular.active}
                  </span>
                </div>
              )}
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>
                {short}
              </p>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "var(--font-mono, monospace)" }}>
                {meta.genre}
              </p>
              <p style={{ margin: "0.4rem 0 0", fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color, opacity: 0.85 }}>
                {hours.toLocaleString()} {t.extracurricular.hoursShort}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
