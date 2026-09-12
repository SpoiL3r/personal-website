"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";

/** Build date, inlined at compile time. Not the content-edit date - a
  * dependency bump moves it too. */
const BUILT = process.env.NEXT_PUBLIC_BUILD_DATE ?? "";

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
          {"©"} {BUILT.slice(0, 4)} {t.footer.copyright}. {t.footer.builtWith}
          {BUILT && (
            <>
              {" "}
              {t.footer.updated} <time dateTime={BUILT}>{BUILT}</time>
            </>
          )}
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
