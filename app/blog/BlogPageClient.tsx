"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";

export default function BlogPageClient() {
  const { t } = useLocale();

  return (
    <div className="site-wrap section">
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{t.blog.title}</h1>
      <p style={{ marginBottom: "3rem" }}>{t.blog.intro}</p>

      <div
        style={{
          border: "1px dashed var(--border)",
          borderRadius: "8px",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--accent)",
            fontSize: "0.8rem",
            marginBottom: "0.75rem",
          }}
        >
          {t.blog.comingSoon}
        </p>
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "0.9rem",
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {t.blog.firstPost}
        </p>
      </div>
    </div>
  );
}
