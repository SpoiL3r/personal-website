"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import LocaleToggle from "@/components/locale/LocaleToggle";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { GITHUB_AVATAR_URL } from "@/lib/constants/profile";
import { NAV_ITEMS, hrefForNavItem, isNavItemActive, shouldSmoothScroll } from "@/lib/navigation/navModel.mjs";

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

    if (!shouldSmoothScroll(item, pathname) || !item.target) return;

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

    if (item.target === "home") {
      window.scrollTo({ top: 0 });
      return;
    }

    document.getElementById(item.target)?.scrollIntoView({ block: "start" });
  }

  return (
    <header className="nav">
      <div className="site-wrap nav-inner">
        <Link
          href={hrefForNavItem(NAV_ITEMS[0], pathname)}
          onClick={(e) => handleClick(e, NAV_ITEMS[0])}
          className="nav-brand"
          aria-label="Go to home"
        >
          <span className="nav-avatar">
            <Image
              src={GITHUB_AVATAR_URL}
              alt=""
              width={56}
              height={56}
              referrerPolicy="no-referrer"
            />
          </span>
          <span className="nav-name">{t.about.fullName}</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(item, pathname, activeId);
            return (
              <Link
                key={item.key}
                href={hrefForNavItem(item, pathname)}
                onClick={(e) => handleClick(e, item)}
                className={`nav-link ${active ? "is-active" : ""}`}
              >
                {t.nav[item.labelKey]}
              </Link>
            );
          })}
        </nav>

        <div className="nav-controls">
          <span className="nav-locale-desktop">
            <LocaleToggle />
          </span>
          <ThemeToggle />
          <button
            className="icon-btn nav-hamburger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <div className="nav-sheet" hidden={!mobileOpen}>
        {NAV_ITEMS.map((item) => {
          const active = isNavItemActive(item, pathname, activeId);
          return (
            <Link
              key={item.key}
              href={hrefForNavItem(item, pathname)}
              onClick={(e) => handleClick(e, item)}
              className={active ? "is-active" : undefined}
            >
              {t.nav[item.labelKey]}
            </Link>
          );
        })}
        <div className="nav-sheet-controls">
          <LocaleToggle />
        </div>
      </div>
    </header>
  );
}
