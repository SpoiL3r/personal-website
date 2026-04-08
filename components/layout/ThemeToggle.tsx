"use client";

import { useTheme } from "next-themes";
import { useRef } from "react";
import { BsSun, BsMoonStarsFill } from "react-icons/bs";

// antfu.me-style theme switch: View Transitions API + circular clip-path reveal
// from the click point. Falls back to instant switch on unsupported browsers.
type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);

  // Render a button skeleton before theme is resolved so the server and client
  // render the same element type — avoids React hydration mismatch.
  if (!theme) return <button style={{ width: 36, height: 32, visibility: "hidden", flexShrink: 0 }} aria-hidden tabIndex={-1} />;

  const isDark = theme === "dark";

  /**
   * Tactile mechanical-switch click (~90ms total).
   *
   * Three layered components, all very short:
   *   1. TICK  — high-frequency noise transient (the plastic surface contact)
   *   2. BODY  — low sine thump with sharp pitch drop (the lever bottoming out)
   *   3. SNAP  — bandpassed resonance for the metallic "snap" character
   *
   * Dark = lower body pitch (deeper "thunk")
   * Light = higher body pitch (crisper "tick")
   */
  function playClick(toDark: boolean) {
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);

      // ── 1. TICK — sharp noise transient, 8ms ──
      const tickBuf = ctx.createBuffer(1, ctx.sampleRate * 0.012, ctx.sampleRate);
      const tickData = tickBuf.getChannelData(0);
      for (let i = 0; i < tickData.length; i++) {
        // Linear decay over 12ms — sharp attack, fast fall
        tickData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / tickData.length, 2);
      }
      const tickSrc = ctx.createBufferSource();
      tickSrc.buffer = tickBuf;
      const tickHp = ctx.createBiquadFilter();
      tickHp.type = "highpass";
      tickHp.frequency.value = 3500;
      const tickGain = ctx.createGain();
      tickGain.gain.value = 0.55;
      tickSrc.connect(tickHp).connect(tickGain).connect(master);
      tickSrc.start(now);
      tickSrc.stop(now + 0.012);

      // ── 2. BODY — low sine thump with fast pitch drop, ~60ms ──
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = "sine";
      const bodyStart = toDark ? 220 : 320;
      const bodyEnd   = toDark ? 90  : 140;
      bodyOsc.frequency.setValueAtTime(bodyStart, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(bodyEnd, now + 0.05);
      bodyGain.gain.setValueAtTime(0.0001, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.7, now + 0.003);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      bodyOsc.connect(bodyGain).connect(master);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.08);

      // ── 3. SNAP — bandpassed noise for metallic snap character, ~25ms ──
      const snapBuf = ctx.createBuffer(1, ctx.sampleRate * 0.025, ctx.sampleRate);
      const snapData = snapBuf.getChannelData(0);
      for (let i = 0; i < snapData.length; i++) {
        snapData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / snapData.length, 3);
      }
      const snapSrc = ctx.createBufferSource();
      snapSrc.buffer = snapBuf;
      const snapBp = ctx.createBiquadFilter();
      snapBp.type = "bandpass";
      snapBp.frequency.value = toDark ? 1800 : 2400;
      snapBp.Q.value = 6;
      const snapGain = ctx.createGain();
      snapGain.gain.value = 0.4;
      snapSrc.connect(snapBp).connect(snapGain).connect(master);
      snapSrc.start(now + 0.002);
      snapSrc.stop(now + 0.027);
    } catch {
      // AudioContext unavailable
    }
  }

  function applyTheme(next: "dark" | "light") {
    document.documentElement.classList.add("theme-transitioning");
    setTheme(next);
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 200);
  }

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    playClick(isDark);
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
      ref={btnRef}
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
