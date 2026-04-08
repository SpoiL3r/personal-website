/**
 * @file LocaleContext.tsx
 * @description React context for site-wide internationalisation (i18n).
 *
 * Manages the active locale ("en" | "hi" | "de"), exposes the corresponding
 * Translations dictionary as `t`, and persists the user's choice to
 * localStorage so it survives page refreshes.
 *
 * Exports:
 *  - `Locale`          — union type of supported locale codes
 *  - `LocaleProvider`  — context provider; wrap the app root with this
 *  - `useLocale`       — hook to read/update the active locale inside any component
 */
"use client";

import React, { createContext, useContext, useState } from "react";
import { en } from "../locales/en";
import { hi } from "../locales/hi";
import { de } from "../locales/de";
import type { Translations } from "../locales/types";

/** Supported locale codes. Add a new code here when adding a new language. */
export type Locale = "en" | "hi" | "de";

/**
 * Shape of the value provided by {@link LocaleContext}.
 *
 * @property locale    - Currently active locale code.
 * @property t         - Full translation dictionary for the active locale.
 * @property setLocale - Switches the active locale and persists it to localStorage.
 */
interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

/** Lookup map from locale code to its compiled Translations object. */
const DICTIONARIES: Record<Locale, Translations> = { en, hi, de };

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  t: en,
  setLocale: () => {},
});

/** localStorage key used to persist the user's locale preference. */
const STORAGE_KEY = "preferred-locale";

/**
 * Reads the persisted locale from localStorage.
 *
 * Returns "en" as a safe default in two cases:
 *  1. Running on the server (SSR) — `window` is not available.
 *  2. The stored value is absent or not a recognised locale code.
 */
function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "hi" || stored === "de" ? stored : "en";
}

/**
 * Provides locale state to the component tree.
 *
 * Initialises the locale by calling {@link getInitialLocale} (lazy `useState`
 * initialiser, so it only runs once on mount).
 *
 * @param children - React children that will have access to the locale context.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  /**
   * Updates the active locale in state and writes the new value to localStorage
   * so the preference is restored on the next visit.
   *
   * @param next - The locale code to switch to.
   */
  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  const t = DICTIONARIES[locale];

  return (
    <LocaleContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Hook that returns the current locale context value.
 *
 * Must be used inside a {@link LocaleProvider}.
 *
 * @returns `{ locale, t, setLocale }` from the nearest LocaleProvider.
 */
export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
