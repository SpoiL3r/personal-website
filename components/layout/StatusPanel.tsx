"use client";

import {
  MANUAL_OPTIONS,
  PRESENCE_COLORS,
  type Status,
  type StatusId,
  type StatusMode,
} from "@/lib/hooks/useProfileStatus";

export interface StatusPanelProps {
  mode: StatusMode;
  setMode: (m: StatusMode) => void;
  manualStatus: StatusId;
  setManualStatus: (s: StatusId) => void;
  statusMap: Record<StatusId, Status>;
  bengaluruTime: { weekday: string; hour: number; minute: number };
  todayKey: string;
  todayIsHoliday: boolean;
  todayIsManualHoliday: boolean;
  toggleTodayHoliday: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

export function StatusPanel({
  mode,
  setMode,
  manualStatus,
  setManualStatus,
  statusMap,
  bengaluruTime,
  todayIsHoliday,
  todayIsManualHoliday,
  toggleTodayHoliday,
  t,
}: StatusPanelProps) {
  return (
    <div
      role="dialog"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        width: "300px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-strong)",
        borderRadius: "12px",
        padding: "0.4rem",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        display: "flex",
        flexDirection: "column",
        gap: "0.45rem",
        animation: "status-pop 0.18s ease-out",
      }}
    >
      <div
        style={{
          fontSize: "0.62rem",
          fontFamily: "var(--font-mono)",
          color: "var(--text-dim)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          padding: "0.5rem 0.7rem 0.1rem",
        }}
      >
        {t.status.panelTitle}
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          padding: "0 0.55rem",
        }}
      >
        {(["auto", "manual"] as const).map((option) => {
          const active = mode === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              style={{
                flex: 1,
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: active ? "var(--bg-hover)" : "transparent",
                color: active ? "var(--text)" : "var(--text-muted)",
                padding: "0.45rem 0.6rem",
                fontSize: "0.75rem",
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {option === "auto" ? t.status.autoMode : t.status.manualMode}
            </button>
          );
        })}
      </div>

      <div
        style={{
          padding: "0 0.7rem",
          color: "var(--text-dim)",
          fontSize: "0.72rem",
          lineHeight: 1.45,
        }}
      >
        {mode === "auto"
          ? `${t.status.scheduleNow} - ${bengaluruTime.weekday} ${String(bengaluruTime.hour).padStart(2, "0")}:${String(bengaluruTime.minute).padStart(2, "0")} IST${todayIsHoliday ? ` - ${t.status.holidayModeActive}` : ""}`
          : t.status.manualOverrideActive}
      </div>

      {mode === "auto" && (
        <>
          <div
            style={{
              padding: "0 0.7rem",
              color: "var(--text-dim)",
              fontSize: "0.72rem",
              lineHeight: 1.45,
            }}
          >
            {t.status.autoHolidayNote}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              padding: "0 0.7rem",
            }}
          >
            <span style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>
              {t.status.markTodayHoliday}
            </span>
            <button
              type="button"
              onClick={toggleTodayHoliday}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "999px",
                background: todayIsManualHoliday ? "var(--bg-hover)" : "transparent",
                color: todayIsManualHoliday ? "var(--text)" : "var(--text-muted)",
                padding: "0.35rem 0.7rem",
                fontSize: "0.72rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {todayIsManualHoliday ? t.status.holidayOn : t.status.holidayOff}
            </button>
          </div>
        </>
      )}

      {mode === "manual" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {MANUAL_OPTIONS.map((option) => {
            const entry = statusMap[option];
            const active = manualStatus === option;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setManualStatus(entry.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.55rem 0.7rem",
                  borderRadius: "8px",
                  border: "none",
                  background: active ? "var(--bg-hover)" : "transparent",
                  color: active ? "var(--text)" : "var(--text-muted)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: active ? 600 : 500,
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: PRESENCE_COLORS[entry.presence],
                    boxShadow: `0 0 6px ${PRESENCE_COLORS[entry.presence]}aa`,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "0.95rem", display: "inline-flex", alignItems: "center" }}>{entry.icon}</span>
                <span style={{ flex: 1 }}>{entry.text}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {[
            t.status.scheduleWeekdayWork,
            t.status.scheduleCoffee,
            t.status.scheduleLunch,
            t.status.scheduleAvailability,
            t.status.scheduleSleeping,
            t.status.scheduleWeekend,
            t.status.scheduleHoliday,
          ].map((line) => (
            <div
              key={line}
              style={{
                padding: "0.55rem 0.7rem",
                borderRadius: "8px",
                color: "var(--text-muted)",
                fontSize: "0.76rem",
                lineHeight: 1.45,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
