"use client";

import { useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Discord-style presence indicator shown on the avatar dot and pill. */
export type Presence = "available" | "busy" | "away" | "dnd" | "offline";

/** Whether the status is computed automatically or set by the owner. */
export type StatusMode = "auto" | "manual";

/**
 * All possible named statuses. Each maps to a Presence level
 * (see PRESENCE_BY_STATUS) and carries a display icon + i18n text.
 */
export type StatusId =
  | "working"
  | "coffee"
  | "lunch"
  | "available"
  | "cs2"
  | "overwatch"
  | "learning"
  | "sleeping"
  | "vacation";

/** Fully-resolved display status shown in the pill. */
export interface Status {
  id: StatusId;
  presence: Presence;
  /** Emoji string or a React icon node (e.g. MoonStar for sleeping). */
  icon: React.ReactNode;
  /** Translated label string from the locale context. */
  text: string;
}

/** Shape returned by the /api/holidays endpoint. */
interface HolidayResponse {
  /** ISO-8601 date strings (YYYY-MM-DD) for the current calendar year. */
  dates?: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Solid dot color for each presence state (used on the avatar indicator). */
export const PRESENCE_COLORS: Record<Presence, string> = {
  available: "#22c55e",
  busy: "#ef4444",
  away: "#facc15",
  dnd: "#ef4444",
  offline: "#6b7280",
};

/**
 * Per-presence theme tokens for the pill chip.
 * background / border use rgba so the pill remains semi-transparent over
 * the blurred backdrop. textLight / textDark are swapped based on
 * resolvedTheme so the label stays legible in both colour schemes.
 */
export const PRESENCE_PILL_STYLES: Record<Presence, {
  background: string; border: string;
  textLight: string; textDark: string;
  shadow: string;
}> = {
  available: {
    background: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.32)",
    textLight: "#166534",
    textDark: "#4ade80",
    shadow: "0 10px 24px rgba(34, 197, 94, 0.12)",
  },
  busy: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.32)",
    textLight: "#b91c1c",
    textDark: "#f87171",
    shadow: "0 10px 24px rgba(239, 68, 68, 0.14)",
  },
  away: {
    background: "rgba(250, 204, 21, 0.14)",
    border: "rgba(234, 179, 8, 0.34)",
    textLight: "#854d0e",
    textDark: "#fbbf24",
    shadow: "0 10px 24px rgba(234, 179, 8, 0.14)",
  },
  dnd: {
    background: "rgba(239, 68, 68, 0.14)",
    border: "rgba(239, 68, 68, 0.38)",
    textLight: "#991b1b",
    textDark: "#f87171",
    shadow: "0 10px 24px rgba(239, 68, 68, 0.16)",
  },
  offline: {
    background: "rgba(107, 114, 128, 0.14)",
    border: "rgba(107, 114, 128, 0.34)",
    textLight: "#374151",
    textDark: "#9ca3af",
    shadow: "0 10px 24px rgba(107, 114, 128, 0.12)",
  },
};

/** localStorage key — persists "auto" | "manual" mode across page loads. */
const MODE_KEY = "vs-status-mode";
/** localStorage key — persists the last manually selected StatusId. */
const MANUAL_STATUS_KEY = "vs-manual-status";
/** localStorage key — JSON array of ISO date strings the owner marked as holidays locally. */
const HOLIDAY_KEY = "vs-holiday-dates";

/** Ordered list of statuses shown in the manual-pick dropdown. */
export const MANUAL_OPTIONS: StatusId[] = [
  "vacation",
  "available",
  "working",
  "coffee",
  "lunch",
  "learning",
  "cs2",
  "overwatch",
  "sleeping",
];

/** Maps each StatusId to its corresponding Discord-style Presence level. */
export const PRESENCE_BY_STATUS: Record<StatusId, Presence> = {
  working: "busy",
  coffee: "away",
  lunch: "away",
  available: "available",
  cs2: "dnd",
  overwatch: "dnd",
  learning: "available",
  sleeping: "offline",
  vacation: "away",
};

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

/**
 * Returns the current weekday name, hour (0-23), and minute (0-59) expressed
 * in Indian Standard Time (Asia/Kolkata, UTC+5:30), regardless of the
 * visitor's local timezone.
 */
export function getBengaluruParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  ) as Record<"weekday" | "hour" | "minute", string>;

  return {
    weekday: values.weekday,
    hour: Number(values.hour),
    minute: Number(values.minute),
  };
}

/**
 * Derives the current StatusId from the Bengaluru wall-clock time.
 */
function getAutomaticStatusId(date = new Date()): StatusId {
  const { weekday, hour, minute } = getBengaluruParts(date);
  const totalMinutes = hour * 60 + minute;
  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const gamingStatus: StatusId = date.getDate() % 2 === 0 ? "cs2" : "overwatch";

  if (isWeekend) {
    if (totalMinutes < 9 * 60) return "sleeping";
    if (totalMinutes < 12 * 60) return "learning";
    if (totalMinutes < 19 * 60) return gamingStatus;
    return "available";
  }

  if (totalMinutes < 7 * 60) return "sleeping";
  if (totalMinutes < 8 * 60 + 30) return "learning";
  if (totalMinutes < 9 * 60) return "available";
  if (totalMinutes < 9 * 60 + 30) return "working";
  if (totalMinutes < 10 * 60) return "coffee";
  if (totalMinutes < 12 * 60) return "working";
  if (totalMinutes < 13 * 60) return "lunch";
  if (totalMinutes < 17 * 60) return "working";
  if (totalMinutes < 19 * 60) return "available";
  return gamingStatus;
}

/**
 * Returns true when the page is running on the owner's local machine.
 */
function isLocalOwnerEnvironment() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

/**
 * Reads the persisted StatusMode from localStorage.
 * Defaults to "auto" on the server or when no value has been saved yet.
 */
function getInitialMode(): StatusMode {
  if (typeof window === "undefined") return "auto";
  return localStorage.getItem(MODE_KEY) === "manual" ? "manual" : "auto";
}

/**
 * Reads the persisted manual StatusId from localStorage.
 * Falls back to "available" if the stored value is absent or no longer valid.
 */
function getInitialManualStatus(): StatusId {
  if (typeof window === "undefined") return "available";
  const stored = localStorage.getItem(MANUAL_STATUS_KEY);
  return stored && stored in PRESENCE_BY_STATUS ? (stored as StatusId) : "available";
}

/**
 * Reads the owner-defined holiday overrides from localStorage.
 * Returns an empty array on parse errors or when the key doesn't exist.
 */
function getInitialHolidayDates(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(HOLIDAY_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Returns today's date as a YYYY-MM-DD string in IST.
 */
export function getBengaluruDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// ---------------------------------------------------------------------------
// Hook return type
// ---------------------------------------------------------------------------

export interface ProfileStatusState {
  statusId: StatusId;
  presence: Presence;
  mode: StatusMode;
  setMode: (m: StatusMode) => void;
  manualStatus: StatusId;
  setManualStatus: (s: StatusId) => void;
  manualHolidayDates: string[];
  toggleTodayHoliday: () => void;
  allHolidayDates: string[];
  bengaluruTime: { weekday: string; hour: number; minute: number };
  todayKey: string;
  todayIsHoliday: boolean;
  todayIsManualHoliday: boolean;
  isOwner: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProfileStatus(): ProfileStatusState {
  const [mode, setMode] = useState<StatusMode>(getInitialMode);
  const [manualStatus, setManualStatus] = useState<StatusId>(getInitialManualStatus);
  const [manualHolidayDates, setManualHolidayDates] = useState<string[]>(getInitialHolidayDates);
  const [remoteHolidayDates, setRemoteHolidayDates] = useState<string[]>([]);
  const [autoStatus, setAutoStatus] = useState<StatusId>(() => getAutomaticStatusId());
  const [isOwner] = useState(isLocalOwnerEnvironment);

  // Merge owner-toggled holidays with remotely fetched holidays, deduped.
  const allHolidayDates = useMemo(
    () => Array.from(new Set([...manualHolidayDates, ...remoteHolidayDates])),
    [manualHolidayDates, remoteHolidayDates],
  );

  // Fetch holiday dates from the API once on mount.
  useEffect(() => {
    let cancelled = false;

    async function loadHolidayDates() {
      try {
        const response = await fetch("/api/holidays", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as HolidayResponse;
        if (!cancelled && Array.isArray(data.dates)) {
          setRemoteHolidayDates(data.dates.filter((value): value is string => typeof value === "string"));
        }
      } catch {
        if (!cancelled) {
          setRemoteHolidayDates([]);
        }
      }
    }

    void loadHolidayDates();

    return () => {
      cancelled = true;
    };
  }, []);

  // Re-derive the auto status every 60 s.
  useEffect(() => {
    const syncStatus = () => {
      const todayKey = getBengaluruDateKey();
      if (allHolidayDates.includes(todayKey)) {
        setAutoStatus("vacation");
        return;
      }

      setAutoStatus(getAutomaticStatusId());
    };

    syncStatus();
    const intervalId = window.setInterval(syncStatus, 60_000);
    return () => window.clearInterval(intervalId);
  }, [allHolidayDates]);

  // Persist mode.
  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  // Persist the chosen manual status.
  useEffect(() => {
    localStorage.setItem(MANUAL_STATUS_KEY, manualStatus);
  }, [manualStatus]);

  // Persist the owner's local holiday overrides.
  useEffect(() => {
    localStorage.setItem(HOLIDAY_KEY, JSON.stringify(manualHolidayDates));
  }, [manualHolidayDates]);

  const statusId: StatusId = mode === "manual" ? manualStatus : autoStatus;
  const presence: Presence = PRESENCE_BY_STATUS[statusId];
  const bengaluruTime = getBengaluruParts();
  const todayKey = getBengaluruDateKey();
  const todayIsHoliday = allHolidayDates.includes(todayKey);
  const todayIsManualHoliday = manualHolidayDates.includes(todayKey);

  const toggleTodayHoliday = () => {
    setManualHolidayDates((previous) =>
      previous.includes(todayKey)
        ? previous.filter((entry) => entry !== todayKey)
        : [...previous, todayKey],
    );
  };

  return {
    statusId,
    presence,
    mode,
    setMode,
    manualStatus,
    setManualStatus,
    manualHolidayDates,
    toggleTodayHoliday,
    allHolidayDates,
    bengaluruTime,
    todayKey,
    todayIsHoliday,
    todayIsManualHoliday,
    isOwner,
  };
}
