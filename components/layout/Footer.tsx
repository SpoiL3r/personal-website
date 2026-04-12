"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";

export default function Footer() {
  const { t } = useLocale();

  const links = [
    {
      label: t.social.github,
      href: "https://github.com/SpoiL3r",
    },
    {
      label: t.social.linkedin,
      href: "https://linkedin.com/in/vaibhavcs",
    },
    {
      label: t.footer.email,
      href: "mailto:think.vaibhavsingh@gmail.com",
    },
  ];

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "1.5rem 0 2rem",
        marginTop: "3.5rem",
      }}
    >
      <div
        className="site-wrap"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.9rem 1.25rem",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.82rem",
            color: "var(--text-dim)",
          }}
        >
          {"\u00A9"} {new Date().getFullYear()} {t.footer.copyright}. {t.footer.builtWith}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="footer-link"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
