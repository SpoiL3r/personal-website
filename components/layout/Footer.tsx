"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";

export default function Footer() {
  const { t } = useLocale();

  const links = [
    { label: t.social.github, href: "https://github.com/SpoiL3r" },
    { label: t.social.linkedin, href: "https://linkedin.com/in/vaibhavcs" },
    { label: t.footer.email, href: "mailto:think.vaibhavsingh@gmail.com" },
  ];

  return (
    <footer className="footer">
      <div className="site-wrap footer-inner">
        <p className="meta-date">
          {"©"} {new Date().getFullYear()} {t.footer.copyright}. {t.footer.builtWith}
        </p>

        <div className="footer-links">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="small link-quiet"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
