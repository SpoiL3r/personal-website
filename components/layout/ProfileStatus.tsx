/**
 * ProfileStatus — fixed top-left avatar + presence pill widget.
 *
 * Key concepts:
 *  - All time calculations are performed in IST (Asia/Kolkata, UTC+5:30).
 *  - The component has two modes:
 *      "auto"   — status is derived from Bengaluru work-hour schedule, refreshed every 60 s.
 *      "manual" — site owner picks a status from a dropdown; choice persists in localStorage.
 *  - Holiday detection: dates from the /api/holidays endpoint (Nager + RBI) are merged with
 *    any owner-toggled "today is a holiday" overrides. On holiday → status becomes "vacation".
 *  - The settings panel is gated to the local-owner environment (localhost / 127.0.0.1).
 *    Keyboard shortcut: Ctrl/Cmd + Shift + S toggles the panel.
 *  - localStorage keys used: MODE_KEY, MANUAL_STATUS_KEY, HOLIDAY_KEY (see hook).
 */
"use client";

import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLocale } from "@/lib/contexts/LocaleContext";
import {
  useProfileStatus,
  PRESENCE_COLORS,
  PRESENCE_PILL_STYLES,
  type Status,
  type StatusId,
} from "@/lib/hooks/useProfileStatus";
import { StatusPanel } from "./StatusPanel";

/** Steam CDN URL for the profile avatar image. */
const STEAM_AVATAR =
  "https://avatars.steamstatic.com/6f07fc5ce9e7979b0b5293ac501375936fbe7610_full.jpg";

/**
 * ProfileStatus — renders the fixed avatar + presence pill in the top-left
 * corner. On localhost it also exposes an owner-only settings panel
 * (Ctrl/Cmd + Shift + S) for switching between auto and manual modes and for
 * toggling today as a holiday.
 */
export default function ProfileStatus() {
  const { t } = useLocale();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [open, setOpen] = useState(false);

  const {
    statusId,
    presence,
    mode,
    setMode,
    manualStatus,
    setManualStatus,
    toggleTodayHoliday,
    bengaluruTime,
    todayKey,
    todayIsHoliday,
    todayIsManualHoliday,
    isOwner,
  } = useProfileStatus();

  // Build statusMap here — needs `t` from locale and MoonStar icon.
  const statusMap: Record<StatusId, Status> = {
    working: { id: "working", presence: "busy", icon: "💻", text: t.status.workingLabel },
    coffee: { id: "coffee", presence: "away", icon: "☕", text: t.status.coffeeLabel },
    lunch: { id: "lunch", presence: "away", icon: "🍽️", text: t.status.lunchLabel },
    available: { id: "available", presence: "available", icon: "🎯", text: t.status.availableLabel },
    cs2: { id: "cs2", presence: "dnd", icon: "🎮", text: t.status.cs2Label },
    overwatch: { id: "overwatch", presence: "dnd", icon: "🎮", text: t.status.overwatchLabel },
    learning: { id: "learning", presence: "available", icon: "📚", text: t.status.learningLabel },
    sleeping: { id: "sleeping", presence: "offline", icon: <MoonStar size={14} strokeWidth={2.1} />, text: t.status.sleepingLabel },
    vacation: { id: "vacation", presence: "away", icon: "↗️", text: t.status.vacationLabel },
  };

  const status = statusMap[statusId];
  const dotColor = PRESENCE_COLORS[presence];
  const pillStyle = PRESENCE_PILL_STYLES[presence];
  const pillTextColor = isDark ? pillStyle.textDark : pillStyle.textLight;

  // Keyboard shortcut (owner-only): Ctrl/Cmd + Shift + S toggles the panel.
  // Escape always closes it.
  useEffect(() => {
    if (!isOwner) return;

    function onKey(event: KeyboardEvent) {
      const mod = event.ctrlKey || event.metaKey;
      if (mod && event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        setOpen((value) => !value);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOwner]);

  // Click-outside dismissal: close when clicking anywhere outside the
  // component's root element (identified by the data-profile-status attribute).
  useEffect(() => {
    if (!open) return;

    function onDocClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-profile-status]")) {
        setOpen(false);
      }
    }

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  return (
    <div
      data-profile-status
      className="profile-status-wrap"
      style={{
        position: "fixed",
        top: "10px",
        left: "16px",
        zIndex: 200,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
      }}
    >
      <div
        onClick={() => isOwner && setOpen((value) => !value)}
        role={isOwner ? "button" : undefined}
        aria-label={isOwner ? "View status controls" : "Profile status"}
        title={isOwner ? "View status controls" : "Profile status"}
        style={{
          position: "relative",
          width: "36px",
          height: "36px",
          flexShrink: 0,
          cursor: isOwner ? "pointer" : "default",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid var(--border-strong)",
            transition: "border-color 0.2s, transform 0.18s",
          }}
          onMouseEnter={(event) => {
            if (!isOwner) return;
            event.currentTarget.style.borderColor = "var(--accent)";
            event.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.borderColor = "var(--border-strong)";
            event.currentTarget.style.transform = "scale(1)";
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={STEAM_AVATAR}
            alt="Vaibhav Singh"
            width={36}
            height={36}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            width: "13px",
            height: "13px",
            borderRadius: "50%",
            background: dotColor,
            border: "2.5px solid var(--bg)",
            boxShadow: `0 0 10px ${dotColor}cc, 0 0 0 1px rgba(0,0,0,0.15)`,
            transition: "background 0.3s, box-shadow 0.3s",
            zIndex: 2,
          }}
        />
      </div>

      <div
        className="status-pill"
        onClick={() => isOwner && setOpen((value) => !value)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.35rem 0.75rem",
          borderRadius: "16px",
          background: pillStyle.background,
          border: `1px solid ${pillStyle.border}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          fontSize: "0.74rem",
          color: pillTextColor,
          fontFamily: "var(--font-sans)",
          cursor: isOwner ? "pointer" : "default",
          whiteSpace: "nowrap",
          maxWidth: "240px",
          userSelect: "none",
          boxShadow: pillStyle.shadow,
          transition: "background 0.25s, border-color 0.25s, color 0.25s, box-shadow 0.25s",
        }}
        title={isOwner ? t.status.triggerTitle : status.text}
      >
        <span style={{ fontSize: "0.85rem", lineHeight: 1, display: "inline-flex", alignItems: "center" }}>{status.icon}</span>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "180px",
          }}
        >
          {status.text}
        </span>
      </div>

      {open && isOwner && (
        <StatusPanel
          mode={mode}
          setMode={setMode}
          manualStatus={manualStatus}
          setManualStatus={setManualStatus}
          statusMap={statusMap}
          bengaluruTime={bengaluruTime}
          todayKey={todayKey}
          todayIsHoliday={todayIsHoliday}
          todayIsManualHoliday={todayIsManualHoliday}
          toggleTodayHoliday={toggleTodayHoliday}
          t={t}
        />
      )}
    </div>
  );
}
