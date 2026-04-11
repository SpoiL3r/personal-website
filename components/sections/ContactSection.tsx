"use client";

import React from "react";
import { Mail, Download, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Section from "./Section";
import { useTrophies } from "@/lib/contexts/TrophyContext";
import { useLocale } from "@/lib/contexts/LocaleContext";

export default function ContactSection() {
  const { unlock } = useTrophies();
  const { t } = useLocale();
  const socials = [
    { Icon: FaXTwitter, label: t.social.x, href: "https://x.com/vaibhav_think", bg: "#000000", trophy: null },
    { Icon: FaGithub, label: t.social.github, href: "https://github.com/SpoiL3r", bg: "#24292e", trophy: "github_hunter" as const },
    { Icon: FaLinkedin, label: t.social.linkedin, href: "https://linkedin.com/in/vaibhavcs", bg: "#0077b5", trophy: "linkedin_stalker" as const },
  ];

  return (
    <Section
      id="contact"
      title={t.sections.contactTitle}
      subtitle={t.sections.contactSubtitle}
    >
      <div
        className="hud-card"
        style={{
          background: "var(--bg-card)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Primary CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
          <a
            href="mailto:think.vaibhavsingh@gmail.com"
            onClick={() => unlock("mail_sender")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              background: "var(--accent)",
              color: "#08080f",
              fontSize: "0.875rem",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 8px 24px var(--glow-teal)",
              transition: "transform 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 32px var(--glow-teal)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px var(--glow-teal)";
            }}
          >
            <Mail size={16} />
            {t.contact.emailMe}
          </a>

          <a
            href="/vaibhav_singh_cv.pdf"
            download
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              background: "transparent",
              color: "var(--text)",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid var(--border-strong)",
              transition: "background 0.18s, border-color 0.18s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-hover)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-strong)";
            }}
          >
            <Download size={16} />
            {t.contact.downloadResume}
          </a>

          <span
            style={{
              fontSize: "0.78rem",
              fontFamily: "var(--font-mono, monospace)",
              color: "var(--text-muted)",
              userSelect: "all",
              marginLeft: "0.25rem",
            }}
          >
            think.vaibhavsingh@gmail.com
          </span>
        </div>

        {/* Location row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          <MapPin size={13} />
          {t.contact.locationLine}
        </div>

        {/* Socials row */}
        <div
          style={{
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono, monospace)",
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.7rem",
            }}
          >
            {t.contact.findMeOn}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
            {socials.map(({ Icon, label, href, bg, trophy }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trophy && unlock(trophy)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "10px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "transform 0.18s, border-color 0.18s, background 0.18s",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = "translateY(-2px)";
                  el.style.borderColor = bg;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "var(--border)";
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "6px",
                    background: bg,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={12} />
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
