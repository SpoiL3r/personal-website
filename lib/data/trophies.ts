/**
 * @file trophies.ts
 * @description Trophy definitions and configuration for the site's achievement system.
 *
 * Each trophy has a stable `id`, an emoji `icon`, and two i18n keys that are
 * resolved at render time via the active `Translations` dictionary.
 *
 * Key types (`TrophyTitleKey`, `TrophyDescKey`) are derived directly from the
 * `Translations["trophies"]` shape in `locales/types.ts`, so adding or removing
 * a translation key is caught by TypeScript here without a separate type update.
 *
 * Exports:
 *  - `TrophyTitleKey`        — union of valid `*_title` keys in the trophies namespace
 *  - `TrophyDescKey`         — union of valid `*_desc` keys in the trophies namespace
 *  - `Trophy`                — shape of a single trophy definition
 *  - `TROPHIES`              — master list of all trophies in display order
 *  - `FULL_PROFILE_THRESHOLD` — number of regular trophies required to auto-unlock "full_profile"
 */
import type { Translations } from "../locales/types";

/**
 * Union of all `*_title` keys in the `Translations["trophies"]` namespace.
 *
 * Derived via `keyof Pick<...>` so the type stays in sync with the translation
 * schema automatically — no manual maintenance required.
 */
export type TrophyTitleKey = keyof Pick<
  Translations["trophies"],
  | "first_visit_title"
  | "about_explorer_title"
  | "exp_deep_dive_title"
  | "tech_curious_title"
  | "chess_fan_title"
  | "gaming_fan_title"
  | "linkedin_stalker_title"
  | "github_hunter_title"
  | "mail_sender_title"
  | "resume_downloader_title"
  | "full_profile_title"
>;

/**
 * Union of all `*_desc` keys in the `Translations["trophies"]` namespace.
 *
 * Mirror of {@link TrophyTitleKey} for description strings.
 */
export type TrophyDescKey = keyof Pick<
  Translations["trophies"],
  | "first_visit_desc"
  | "about_explorer_desc"
  | "exp_deep_dive_desc"
  | "tech_curious_desc"
  | "chess_fan_desc"
  | "gaming_fan_desc"
  | "linkedin_stalker_desc"
  | "github_hunter_desc"
  | "mail_sender_desc"
  | "resume_downloader_desc"
  | "full_profile_desc"
>;

/**
 * A single trophy definition.
 *
 * @property id       - Stable identifier stored in localStorage and used as the unlock key.
 * @property titleKey - i18n key for the trophy's display name.
 * @property descKey  - i18n key for the short description shown in the trophy panel.
 * @property icon     - Emoji displayed on the trophy card.
 */
export interface Trophy {
  id: string;
  titleKey: TrophyTitleKey;
  descKey: TrophyDescKey;
  icon: string;
}

/**
 * Ordered list of all trophies available on the site.
 *
 * "full_profile" is a meta-trophy; it is excluded from the
 * {@link FULL_PROFILE_THRESHOLD} count to prevent self-referential unlocking.
 */
export const TROPHIES: Trophy[] = [
  {
    id: "first_visit",
    icon: "👋",
    titleKey: "first_visit_title",
    descKey: "first_visit_desc",
  },
  {
    id: "about_explorer",
    icon: "🔍",
    titleKey: "about_explorer_title",
    descKey: "about_explorer_desc",
  },
  {
    id: "exp_deep_dive",
    icon: "📈",
    titleKey: "exp_deep_dive_title",
    descKey: "exp_deep_dive_desc",
  },
  {
    id: "tech_curious",
    icon: "⚙️",
    titleKey: "tech_curious_title",
    descKey: "tech_curious_desc",
  },
  {
    id: "chess_fan",
    icon: "♟️",
    titleKey: "chess_fan_title",
    descKey: "chess_fan_desc",
  },
  {
    id: "gaming_fan",
    icon: "🎮",
    titleKey: "gaming_fan_title",
    descKey: "gaming_fan_desc",
  },
  {
    id: "linkedin_stalker",
    icon: "💼",
    titleKey: "linkedin_stalker_title",
    descKey: "linkedin_stalker_desc",
  },
  {
    id: "github_hunter",
    icon: "🐙",
    titleKey: "github_hunter_title",
    descKey: "github_hunter_desc",
  },
  {
    id: "mail_sender",
    icon: "✉️",
    titleKey: "mail_sender_title",
    descKey: "mail_sender_desc",
  },
  {
    id: "resume_downloader",
    icon: "📄",
    titleKey: "resume_downloader_title",
    descKey: "resume_downloader_desc",
  },
  {
    id: "full_profile",
    icon: "🏅",
    titleKey: "full_profile_title",
    descKey: "full_profile_desc",
  },
];

/**
 * Minimum number of non-meta trophies a visitor must unlock before the
 * "full_profile" trophy is automatically awarded.
 *
 * Checked inside `TrophyContext.unlock` after every unlock event.
 */
export const FULL_PROFILE_THRESHOLD = 9;
