/**
 * @file TrophyContext.tsx
 * @description React context that drives the site's trophy / achievement system.
 *
 * Tracks which trophy IDs have been unlocked by the visitor, persists the set
 * to localStorage, and auto-awards the "full_profile" meta-trophy once the
 * visitor unlocks {@link FULL_PROFILE_THRESHOLD} regular trophies.
 *
 * The "first_visit" trophy is granted automatically on the first ever page
 * load, before any explicit user interaction.
 *
 * Exports:
 *  - `TrophyProvider` — context provider; wrap the app root with this
 *  - `useTrophies`    — hook to read unlock state and trigger unlocks from any component
 */
"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { TROPHIES, FULL_PROFILE_THRESHOLD } from "../data/trophies";

/**
 * Shape of the value provided by {@link TrophyContext}.
 *
 * @property unlockedIds - Set of trophy IDs that have been unlocked so far.
 * @property unlock      - Call with a trophy ID to unlock it (idempotent).
 * @property progress    - Number of trophies currently unlocked.
 * @property total       - Total number of trophies defined in {@link TROPHIES}.
 */
interface TrophyContextValue {
  unlockedIds: Set<string>;
  unlock: (id: string) => void;
  progress: number;
  total: number;
}

const TrophyContext = createContext<TrophyContextValue>({
  unlockedIds: new Set(),
  unlock: () => {},
  progress: 0,
  total: TROPHIES.length,
});

/** localStorage key used to persist the visitor's unlocked trophy IDs. */
const STORAGE_KEY = "unlocked-trophies";
/** Broadcast when the visitor reaches 100% trophy completion in this session. */
export const PLATINUM_COMPLETED_EVENT = "platinum:completed";

/**
 * Reads previously unlocked trophies from localStorage and ensures
 * "first_visit" is always present (granted on every visit).
 *
 * Returns an empty Set during SSR since `window` is unavailable on the server.
 */
function getInitialTrophies(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const stored = localStorage.getItem(STORAGE_KEY);
  const initial = stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
  // "first_visit" is a passive trophy — awarded simply by opening the site.
  initial.add("first_visit");
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...initial]));
  return initial;
}

/**
 * Provides trophy state to the component tree.
 *
 * @param children - React children that will have access to the trophy context.
 */
export function TrophyProvider({ children }: { children: React.ReactNode }) {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(getInitialTrophies);
  const previousProgress = useRef(unlockedIds.size);

  /**
   * Unlocks the trophy with the given `id`.
   *
   * - Bails out early (no re-render) if the trophy is already unlocked.
   * - After adding the new ID, counts all non-meta trophies. If the count
   *   reaches {@link FULL_PROFILE_THRESHOLD}, "full_profile" is auto-unlocked.
   * - Persists the updated set to localStorage.
   *
   * Wrapped in `useCallback` to keep the reference stable across renders so
   * consumers don't trigger unnecessary effects.
   *
   * @param id - The `id` field of the {@link Trophy} to unlock.
   */
  const unlock = useCallback((id: string) => {
    setUnlockedIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);

      // Auto-unlock full_profile when threshold met
      // "full_profile" itself is excluded from the count so it doesn't
      // contribute to its own unlock condition.
      const nonMeta = [...next].filter(x => x !== "full_profile");
      if (nonMeta.length >= FULL_PROFILE_THRESHOLD) {
        next.add("full_profile");
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const progress = unlockedIds.size;
  const total = TROPHIES.length;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (previousProgress.current < total && progress === total) {
      window.dispatchEvent(new Event(PLATINUM_COMPLETED_EVENT));
    }
    previousProgress.current = progress;
  }, [progress, total]);

  return (
    <TrophyContext.Provider value={{ unlockedIds, unlock, progress, total }}>
      {children}
    </TrophyContext.Provider>
  );
}

/**
 * Hook that returns the current trophy context value.
 *
 * Must be used inside a {@link TrophyProvider}.
 *
 * @returns `{ unlockedIds, unlock, progress, total }` from the nearest TrophyProvider.
 */
export function useTrophies(): TrophyContextValue {
  return useContext(TrophyContext);
}
