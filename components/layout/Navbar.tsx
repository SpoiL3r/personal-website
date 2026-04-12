"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import LocaleToggle from "@/components/locale/LocaleToggle";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { GITHUB_AVATAR_URL } from "@/lib/constants/profile";
import { NAV_ITEMS, hrefForNavItem, isNavItemActive, shouldSmoothScroll } from "@/lib/navigation/navModel.mjs";

function fastScrollTo(targetY: number) {
  const startY = window.scrollY;
  const dist = targetY - startY;
  const duration = 300;
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  function step(now: number) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + dist * ease(t));
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [activeId, setActiveId] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLocked = useRef(false);
  const lockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;

    const ids = NAV_ITEMS
      .map((item) => item.target)
      .filter((item): item is string => Boolean(item))
      .sort((a, b) => {
        const topA = document.getElementById(a)?.offsetTop ?? Infinity;
        const topB = document.getElementById(b)?.offsetTop ?? Infinity;
        return topA - topB;
      });

    let ticking = false;

    function compute() {
      ticking = false;
      if (isLocked.current) return;

      const scrollY = window.scrollY;
      if (scrollY < 120) {
        setActiveId((prev) => (prev === "home" ? prev : "home"));
        return;
      }

      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      if (scrollY + winH >= docH - 80) {
        const last = ids[ids.length - 1];
        setActiveId((prev) => (prev === last ? prev : last));
        return;
      }

      const activeLine = scrollY + winH * 0.32;
      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= activeLine) current = id;
        else break;
      }

      setActiveId((prev) => (prev === current ? prev : current));
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    function onScroll() {
      setMobileOpen(false);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    };
  }, []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, item: (typeof NAV_ITEMS)[number]) {
    setMobileOpen(false);

    if (!shouldSmoothScroll(item, pathname) || !item.target) {
      return;
    }

    e.preventDefault();
    setActiveId(item.target);
    isLocked.current = true;

    if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      isLocked.current = false;
      lockTimerRef.current = null;
    }, 500);

    const nextUrl = new URL(window.location.href);
    nextUrl.hash = item.target === "home" ? "" : item.target;
    window.history.pushState({}, "", nextUrl);

    const el = document.getElementById(item.target);
    const top = item.target === "home"
      ? 0
      : (el?.getBoundingClientRect().top ?? 0) + window.scrollY - 70;

    fastScrollTo(top);
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid color-mix(in srgb, var(--border) 86%, transparent)",
        background: "color-mix(in srgb, var(--nav-bg) 88%, transparent)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div
        className="site-wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          height: "64px",
        }}
      >
        <Link
          href={hrefForNavItem(NAV_ITEMS[0], pathname)}
          onClick={(e) => handleClick(e, NAV_ITEMS[0])}
          className="nav-profile-link"
          aria-label="Go to home"
          style={{
            minWidth: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.7rem",
            textDecoration: "none",
          }}
        >
          <span className="nav-profile-avatar" aria-hidden>
            <Image
              src={GITHUB_AVATAR_URL}
              alt=""
              width={38}
              height={38}
              className="nav-profile-avatar-img"
              referrerPolicy="no-referrer"
            />
            VS
          </span>
          <span className="nav-profile-copy">
            <span className="nav-profile-name">{t.about.fullName}</span>
          </span>
        </Link>

        <nav
          className="nav-main"
          aria-label="Primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.15rem",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(item, pathname, activeId);
            return (
              <Link
                key={item.key}
                href={hrefForNavItem(item, pathname)}
                onClick={(e) => handleClick(e, item)}
                className={`nav-link-v2 ${active ? "is-active" : ""}`}
              >
                <span className="nav-link-label">{t.nav[item.labelKey]}</span>
                <span className="nav-link-underline" aria-hidden />
              </Link>
            );
          })}
        </nav>

        <div
          className="nav-controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            flexShrink: 0,
          }}
        >
          <span className="nav-locale-desktop">
            <LocaleToggle />
          </span>
          <ThemeToggle />
          <button
            className="nav-hamburger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((value) => !value)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              padding: "0.35rem",
              borderRadius: "8px",
              flexShrink: 0,
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "64px",
              left: 0,
              right: 0,
              background: "var(--bg-card)",
              borderBottom: "1px solid var(--border)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)",
              padding: "0.75rem 1rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item, pathname, activeId);
              return (
                <Link
                  key={item.key}
                  href={hrefForNavItem(item, pathname)}
                  onClick={(e) => handleClick(e, item)}
                  style={{
                    padding: "0.7rem 0.8rem",
                    borderRadius: "10px",
                    fontSize: "0.92rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--text)" : "var(--text-muted)",
                    background: active ? "var(--bg-hover)" : "transparent",
                    textDecoration: "none",
                  }}
                >
                  {t.nav[item.labelKey]}
                </Link>
              );
            })}
            <div
              style={{
                borderTop: "1px solid var(--border)",
                marginTop: "0.5rem",
                paddingTop: "0.75rem",
              }}
            >
              <LocaleToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
