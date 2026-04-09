/**
 * Navbar — sticky site-wide navigation bar.
 *
 * Key behaviours:
 *  - Scroll-spy: position-based (not IntersectionObserver). Picks the section
 *    whose top is closest above an "active line" at ~30% of viewport height.
 *    Top-of-page (< 120px) always resolves to "home"; bottom-of-page always
 *    resolves to the last section.
 *  - Custom scroll animation: fastScrollTo() replaces native smooth-scroll
 *    with a 320ms ease-out-cubic rAF loop for snappier feel.
 *  - Active lock: clicking a nav item locks the highlighted section for 600ms
 *    so the scroll-spy doesn't flicker through intermediate sections.
 *  - Glass crossfade: navbar background and bottom border fade in over the
 *    first 80px of scroll via Framer Motion useTransform.
 *  - Scroll progress bar: a 2px accent-coloured bar at the very top of the
 *    viewport driven by useSpring(scrollYProgress).
 *  - Mobile: the resume button label is hidden via CSS class nav-resume-label;
 *    a spacer div (profile-spacer) reserves the width occupied by ProfileStatus.
 */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LocaleToggle from "@/components/locale/LocaleToggle";
import { useLocale } from "@/lib/contexts/LocaleContext";

interface NavItem {
  /** Anchor id on the home page (e.g. "about") OR an absolute route (e.g. "/blog"). */
  target: string;
  labelKey: "home" | "about" | "experience" | "education" | "offClock" | "blog" | "contact";
}

const NAV: NavItem[] = [
  { target: "home",            labelKey: "home" },
  { target: "experience",      labelKey: "experience" },
  { target: "about",           labelKey: "about" },
  { target: "education",       labelKey: "education" },
  { target: "extracurricular", labelKey: "offClock" },
  { target: "/blog",           labelKey: "blog" },
  { target: "contact",         labelKey: "contact" },
];

/** Snappy custom scroll — 320ms ease-out, much faster than browser default. */
function fastScrollTo(targetY: number) {
  const startY = window.scrollY;
  const dist = targetY - startY;
  const duration = 320;
  const start = performance.now();
  // ease-out cubic
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
  const router = useRouter();
  const { t } = useLocale();
  const [activeId, setActiveId] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  // When the user clicks a nav item we lock the active state for ~600ms so the
  // scroll-spy doesn't paint every section the scroll passes through.
  const isLocked = useRef(false);
  const lockTimerRef = useRef<number | null>(null);

  // Scroll progress bar: springs toward the real scroll fraction for a smooth
  // trailing effect. stiffness=400, damping=40 gives a quick but not instant chase.
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
  // Glass navbar background fades from invisible at 0px to 80% opacity at 80px.
  const glassOpacity = useTransform(scrollY, [0, 20, 80], [0, 0.4, 0.8]);
  // Bottom border mirrors the same fade-in so it only appears once scrolled.
  const borderOpacity = useTransform(scrollY, [0, 20, 80], [0, 0.4, 1]);

  // Scroll-spy: deterministic position-based spy (no IntersectionObserver).
  // Picks whichever section's top edge is closest above an "active line" placed
  // ~30% down the viewport. Top-of-page is special-cased to always = "home".
  useEffect(() => {
    if (pathname !== "/") return;

    // Sort by actual DOM offsetTop so the active-line loop works correctly regardless
    // of NAV array order. The page renders Experience before About in DOM order, but NAV
    // lists About first — without this sort the `else break` exits early and Experience
    // incorrectly wins when scrolled to About.
    const ids = NAV
      .filter(n => !n.target.startsWith("/"))
      .map(n => n.target)
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

      // Top of page → always Home, regardless of section heights
      if (scrollY < 120) {
        setActiveId(prev => (prev === "home" ? prev : "home"));
        return;
      }

      // Bottom of page → always last section
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      if (scrollY + winH >= docH - 80) {
        const last = ids[ids.length - 1];
        setActiveId(prev => (prev === last ? prev : last));
        return;
      }

      // Otherwise: pick the last section whose top is above the active line
      const activeLine = scrollY + winH * 0.3;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= activeLine) current = id;
        else break;
      }
      setActiveId(prev => (prev === current ? prev : current));
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    }

    compute(); // initial
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Close mobile menu on scroll
  useEffect(() => {
    if (!mobileOpen) return;
    function onScroll() { setMobileOpen(false); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  /** Returns true when a nav item should be rendered in its active state. */
  function isActive(item: NavItem) {
    if (item.target.startsWith("/")) {
      // Absolute route: active when the full pathname matches or starts with target.
      return pathname === item.target || pathname.startsWith(item.target + "/");
    }
    // Anchor: active only on the home page and when the scroll-spy agrees.
    return pathname === "/" && activeId === item.target;
  }

  /** Builds the correct href — hash link for anchors, direct path for routes. */
  function hrefFor(item: NavItem) {
    return item.target.startsWith("/") ? item.target : `/#${item.target}`;
  }

  /** Handles nav link clicks: applies micro-bounce CSS, locks active state,
   *  then either lets Next.js route or runs the custom scroll animation. */
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) {
    // Micro-bounce feedback: remove → force reflow → re-add so the CSS
    // animation restarts even when the same link is clicked twice rapidly.
    const linkEl = e.currentTarget;
    linkEl.classList.remove("bounce");
    void linkEl.offsetWidth; // trigger reflow
    linkEl.classList.add("bounce");
    window.setTimeout(() => linkEl.classList.remove("bounce"), 450);

    // Close mobile menu
    setMobileOpen(false);

    // Absolute route — let Next.js handle navigation normally.
    if (item.target.startsWith("/")) return;
    // Anchor on the home page — intercept so we can use fastScrollTo instead.
    e.preventDefault();

    // Lock the highlighted item immediately; unlock after 600ms once the
    // scroll animation has finished so the spy doesn't flicker.
    setActiveId(item.target);
    isLocked.current = true;
    if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      isLocked.current = false;
      lockTimerRef.current = null;
    }, 600);

    // If we're already on /, just scroll. Otherwise navigate to / first and
    // let the hash cause a browser scroll (no custom animation for cross-page).
    if (pathname !== "/") {
      router.push(`/#${item.target}`);
      return;
    }

    const el = document.getElementById(item.target);
    if (!el) return;
    // navH=56 is the exact height of this header (set via height: 56px in JSX).
    // The extra 8px gives a comfortable visual gap above the section heading.
    const navH = 56;
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 8;
    fastScrollTo(top);
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="no-theme-transition"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Glass bg crossfade layer */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "var(--nav-bg)",
          opacity: glassOpacity,
          pointerEvents: "none",
        }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          backgroundColor: "var(--border)",
          opacity: borderOpacity,
          pointerEvents: "none",
        }}
      />
      {/* Scroll progress bar */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "var(--accent)",
          transformOrigin: "left",
          scaleX,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
      <span className="nav-shimmer-line" aria-hidden />
      <div
        className="site-wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
          gap: "1rem",
        }}
      >
        {/* Spacer matching fixed profile-status width so nav links stay centered */}
        <div style={{ width: "180px", flexShrink: 0 }} className="profile-spacer" />

        {/* Desktop nav */}
        <nav
          className="nav-main"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.1rem",
            flex: 1,
            justifyContent: "center",
            flexWrap: "nowrap",
          }}
        >
          {NAV.map(item => {
            const active = isActive(item);
            return (
              <Link
                key={item.target}
                href={hrefFor(item)}
                onClick={e => handleClick(e, item)}
                className={`nav-link-v2 ${active ? "is-active" : ""}`}
              >
                <span className="nav-link-label">{t.nav[item.labelKey]}</span>
                <span className="nav-link-underline" aria-hidden />
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="nav-controls" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <a
            href="/vaibhav_singh_cv.pdf"
            download="Vaibhav_Singh_Resume.pdf"
            className="btn btn-outline nav-resume-btn"
            style={{
              fontSize: "0.78rem",
              padding: "0.3rem 0.75rem",
              height: "32px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <Download size={13} />
            <span className="nav-resume-label">{t.contact.downloadResume}</span>
          </a>
          <LocaleToggle />
          <ThemeToggle />
          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(v => !v)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              padding: "0.25rem",
              borderRadius: "6px",
              flexShrink: 0,
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "56px",
              left: 0,
              right: 0,
              background: "var(--bg-card)",
              borderBottom: "1px solid var(--border)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              zIndex: 49,
              padding: "0.75rem 1rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            {NAV.map(item => {
              const active = isActive(item);
              return (
                <Link
                  key={item.target}
                  href={hrefFor(item)}
                  onClick={e => handleClick(e, item)}
                  style={{
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.92rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "var(--accent)" : "var(--text)",
                    background: active ? "var(--bg-hover)" : "transparent",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {t.nav[item.labelKey]}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
