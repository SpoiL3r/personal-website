/**
 * PlatinumCelebration — full-screen overlay shown when all trophies are earned.
 *
 * Trigger logic (two paths):
 *   1. Automatic: fires once when `progress >= total && total > 0`. The
 *      localStorage key SEEN_KEY ensures it only fires on the first completion,
 *      not on every page load thereafter.
 *   2. Manual replay: any code can call `replayPlatinum()` which dispatches the
 *      PLATINUM_REPLAY_EVENT CustomEvent. This bypasses the SEEN_KEY guard so
 *      the owner can preview the overlay at any time.
 *
 * Audio (playBeep):
 *   Synthesises a 3-note ascending arpeggio (C5 → E5 → G5) using the Web Audio
 *   API. Each note uses a triangle oscillator with an attack/decay gain envelope
 *   so the sound feels celebratory but not jarring. Wrapped in try/catch because
 *   AudioContext construction can throw if the browser blocks autoplay.
 *
 * Confetti (confettiPieces / CONFETTI):
 *   60 rectangular pieces are generated deterministically at module load time
 *   using integer arithmetic (no Math.random) so positions are stable across
 *   re-renders. Each piece has a unique x position (0–100%), staggered delay,
 *   random-looking rotation, size, and one of 7 accent colours.
 */
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrophies } from "@/lib/contexts/TrophyContext";
import { useLocale } from "@/lib/contexts/LocaleContext";

/** localStorage key that marks the celebration as already seen (prevents re-trigger on reload). */
const SEEN_KEY = "platinum-celebrated";
/** Custom event name used by replayPlatinum() to re-show the overlay from anywhere. */
export const PLATINUM_REPLAY_EVENT = "platinum:replay";

/** Fire this from anywhere to re-show the celebration overlay. */
export function replayPlatinum() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PLATINUM_REPLAY_EVENT));
}

/**
 * Generates `count` confetti piece descriptors using deterministic integer
 * arithmetic so the layout is stable across re-renders (no Math.random).
 *
 * Distribution strategy:
 *   x position  — (i * 37) % 100  — prime multiplier spreads pieces evenly 0..99%
 *   delay       — (i % 10) * 0.06 — 10-bucket stagger, 60ms between buckets
 *   rotation    — ((i * 43) % 360) - 180  — ±180° spread for tumbling effect
 *   size        — 6 + ((i * 17) % 8)      — ranges 6–13px for visual variety
 *   color       — cycles through 7 accent palette entries
 */
function confettiPieces(count: number) {
  const pieces: { id: number; x: number; delay: number; color: string; rot: number; size: number }[] = [];
  // 7 brand-adjacent accent colours for a festive but on-theme palette.
  const colors = ["#00c9b1", "#8b5cf6", "#f59e0b", "#ef4444", "#3b82f6", "#22c55e", "#ec4899"];
  for (let i = 0; i < count; i++) {
    pieces.push({
      id: i,
      x: (i * 37) % 100,          // horizontal start position (%)
      delay: (i % 10) * 0.06,     // animation start delay (seconds)
      color: colors[i % colors.length],
      rot: ((i * 43) % 360) - 180, // rotation delta from 0 to ±180°
      size: 6 + ((i * 17) % 8),   // width in px; height = size * 0.4 (thin rectangle)
    });
  }
  return pieces;
}

// Pre-compute once at module load — never changes, safe to share across renders.
const CONFETTI = confettiPieces(60);

export default function PlatinumCelebration() {
  const { progress, total } = useTrophies();
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  /**
   * Plays a short celebratory arpeggio using the Web Audio API.
   *
   * Signal chain per note:  OscillatorNode → GainNode (envelope) → master GainNode → destination
   *
   * Notes: C5 (523.25 Hz) → E5 (659.25 Hz) → G5 (783.99 Hz) — a C major triad.
   * Each note starts 120ms after the previous (i * 0.12 s offset).
   *
   * Gain envelope (attack/decay pattern):
   *   - setValueAtTime(0.0001, t)          — near-zero at note start (avoids click)
   *   - exponentialRampToValueAtTime(0.7, t + 0.01)  — 10ms attack to full volume
   *   - exponentialRampToValueAtTime(0.0001, t + 0.35) — 350ms decay to near-silence
   * exponentialRamp requires a non-zero start value, hence 0.0001 rather than 0.
   *
   * master.gain = 0.18 keeps overall output at a comfortable level.
   * The webkitAudioContext fallback handles older Safari versions.
   * All errors are silently swallowed — audio failure should never break the UI.
   */
  function playBeep() {
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = ctx.currentTime;
      // Master bus — attenuates all notes together to avoid clipping.
      const master = ctx.createGain();
      master.gain.value = 0.18;
      master.connect(ctx.destination);
      // C5, E5, G5 — ascending major arpeggio, staggered 120ms apart.
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        // Triangle wave is softer than sawtooth/square — less harsh for a celebration.
        osc.type = "triangle";
        osc.frequency.value = freq;
        // Gain envelope: near-zero → peak (10ms attack) → near-zero (350ms decay).
        g.gain.setValueAtTime(0.0001, now + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.7, now + i * 0.12 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.35);
        osc.connect(g).connect(master);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4); // stop 40ms after decay ends to release resources
      });
    } catch {
      // Audio context creation or scheduling failed (e.g. autoplay policy).
      // Fail silently — the visual celebration still works.
    }
  }

  // Listen for manual replays from anywhere in the app
  useEffect(() => {
    function onReplay() {
      setVisible(true);
      playBeep();
    }
    window.addEventListener(PLATINUM_REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(PLATINUM_REPLAY_EVENT, onReplay);
  }, []);

  // Automatic trigger: fires once when all trophies are completed for the first time.
  // setTimeout(..., 0) defers the state update to the next event-loop tick so the
  // trophy counter animation finishes before the overlay appears.
  useEffect(() => {
    if (progress < total || total === 0) return;
    if (typeof window === "undefined") return;
    // SEEN_KEY guard: prevents re-showing on every subsequent page visit.
    if (localStorage.getItem(SEEN_KEY) === "1") return;
    localStorage.setItem(SEEN_KEY, "1");
    const id = window.setTimeout(() => {
      setVisible(true);
      playBeep();
    }, 0);
    return () => window.clearTimeout(id);
  }, [progress, total]);

  function close() {
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="platinum-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.68)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            overflow: "hidden",
          }}
        >
          {/* Confetti layer */}
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            {CONFETTI.map(p => (
              <motion.div
                key={p.id}
                initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
                animate={{ y: "110vh", rotate: p.rot, opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 3.5 + (p.id % 5) * 0.3,
                  delay: p.delay,
                  ease: "easeIn",
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: 0,
                  width: p.size,
                  height: p.size * 0.4,
                  background: p.color,
                  borderRadius: "1px",
                  boxShadow: `0 0 6px ${p.color}aa`,
                }}
              />
            ))}
          </div>

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            onClick={e => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: 440,
              width: "90%",
              padding: "2.5rem 2rem 2rem",
              borderRadius: "20px",
              background: "var(--bg-card)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid var(--border-strong)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px var(--accent), 0 0 60px rgba(0,201,177,0.25)",
              textAlign: "center",
            }}
          >
            {/* Glowing trophy */}
            <motion.div
              initial={{ rotate: -8, scale: 0.6 }}
              animate={{ rotate: [0, -6, 6, -4, 4, 0], scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                fontSize: "4.5rem",
                lineHeight: 1,
                marginBottom: "1rem",
                filter: "drop-shadow(0 0 24px rgba(245,158,11,0.65))",
              }}
            >
              🏆
            </motion.div>

            <h2
              style={{
                margin: 0,
                fontSize: "1.6rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                background: "linear-gradient(90deg, #00c9b1, #f59e0b, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.trophies.platinumTitle}
            </h2>

            <p
              style={{
                margin: "0.5rem 0 0",
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                lineHeight: 1.55,
              }}
            >
              {t.trophies.platinumBody}
            </p>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "center",
                gap: "0.6rem",
                flexWrap: "wrap",
              }}
            >
              <a
                href="mailto:think.vaibhavsingh@gmail.com?subject=I%20unlocked%20platinum"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.6rem 1.1rem",
                  borderRadius: "10px",
                  background: "var(--accent)",
                  color: "#08080f",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 8px 22px var(--glow-teal)",
                }}
              >
                {t.trophies.platinumClaim}
              </a>
              <button
                onClick={close}
                style={{
                  padding: "0.6rem 1.1rem",
                  borderRadius: "10px",
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-strong)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.trophies.platinumClose}
              </button>
            </div>

            {/* Small progress confirmation */}
            <div
              style={{
                marginTop: "1.25rem",
                fontSize: "0.65rem",
                fontFamily: "var(--font-mono, monospace)",
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {progress} / {total} · {t.trophies.platinumComplete}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


