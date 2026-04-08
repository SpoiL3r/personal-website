"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/contexts/LocaleContext";

export default function TabBar() {
  const pathname = usePathname();
  const { t } = useLocale();

  const tabs = [
    { href: "/",           label: t.nav.home,       icon: "⌂" },
    { href: "/about",      label: t.nav.about,      icon: "◉" },
    { href: "/experience", label: t.nav.experience, icon: "◈" },
    { href: "/blog",       label: t.nav.blog,       icon: "✦" },
  ];

  return (
    <div style={{
      position: "sticky",
      top: "56px",
      zIndex: 40,
      backgroundColor: "var(--bg)",
      borderBottom: "1px solid var(--border)",
      marginBottom: "2rem",
    }}>
      <div className="site-wrap">
        <div style={{
          display: "flex",
          gap: "0",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {tabs.map(({ href, label, icon }) => {
            const active = href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.85rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: active ? 500 : 400,
                  color: active ? "var(--text)" : "var(--text-muted)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s",
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                }}
              >
                <span style={{ fontSize: "0.8rem", opacity: active ? 1 : 0.5 }}>{icon}</span>
                {label}
                {active && (
                  <motion.span
                    layoutId="tab-indicator"
                    style={{
                      position: "absolute",
                      bottom: "-1px",
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "var(--accent)",
                      borderRadius: "2px 2px 0 0",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
