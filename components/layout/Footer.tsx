"use client";

import { useMemo } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail } from "lucide-react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useTrophies } from "@/lib/contexts/TrophyContext";

export default function Footer() {
  const { t } = useLocale();
  const { unlock } = useTrophies();
  const socials = useMemo(
    () => [
      {
        Icon: FaGithub,
        label: t.social.github,
        href: "https://github.com/SpoiL3r",
        trophy: "github_hunter" as const,
      },
      {
        Icon: FaLinkedin,
        label: t.footer.linkedin,
        href: "https://linkedin.com/in/vaibhavcs",
        trophy: "linkedin_stalker" as const,
      },
      {
        Icon: Mail,
        label: t.footer.email,
        href: "mailto:think.vaibhavsingh@gmail.com",
        trophy: "mail_sender" as const,
      },
    ],
    [t.footer.email, t.footer.linkedin, t.social.github],
  );

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "1.75rem 0",
        marginTop: "3rem",
      }}
    >
      <div
        className="site-wrap"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            color: "var(--text-dim)",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          © {new Date().getFullYear()} {t.footer.copyright}. {t.footer.builtWith}
        </p>

        <div style={{ display: "flex", gap: "0.55rem" }}>
          {socials.map(({ Icon, label, href, trophy }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              onClick={() => unlock(trophy)}
              style={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "color 0.18s, border-color 0.18s, transform 0.18s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

