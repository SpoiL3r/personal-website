"use client";

import { useTheme } from "next-themes";
import { BsMoonStarsFill, BsSun } from "react-icons/bs";

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  if (!theme) {
    return (
      <button
        style={{ width: 36, height: 32, visibility: "hidden", flexShrink: 0 }}
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

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = isDark ? "light" : "dark";
    const doc = document as DocWithVT;

    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyTheme(next);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        { clipPath },
        {
          duration: 520,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
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
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "32px",
        borderRadius: "8px",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-card)",
        color: "var(--text)",
        cursor: "pointer",
        marginLeft: "0.3rem",
        transition: "color 0.2s, border-color 0.2s, background 0.2s, transform 0.18s",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
      }}
    >
      {isDark ? <BsSun size={16} /> : <BsMoonStarsFill size={15} />}
    </button>
  );
}
