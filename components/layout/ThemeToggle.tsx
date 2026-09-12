"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <button
        className="icon-btn"
        style={{ visibility: "hidden" }}
        aria-hidden
        tabIndex={-1}
      />
    );
  }

  const isDark = theme === "dark";

  function applyTheme(next: "dark" | "light") {
    document.documentElement.classList.add("theme-transitioning");
    setTheme(next);
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 200);
  }

  function toggle() {
    const next = isDark ? "light" : "dark";
    const doc = document as DocWithVT;

    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyTheme(next);
      return;
    }

    const transition = doc.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => {
      // One hard edge swept top to bottom: the page reprinted in a single
      // pass, rather than the circle-from-the-button every site ships.
      document.documentElement.animate(
        { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"] },
        {
          duration: 320, // --t-base
          easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", // --ease
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="icon-btn"
    >
      {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
    </button>
  );
}
