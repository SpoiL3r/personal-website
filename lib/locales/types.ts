/**
 * @file types.ts
 * @description Single source of truth for all translation keys used across the site.
 *
 * Every locale file (en.ts, hi.ts, de.ts) must satisfy the `Translations`
 * interface defined here. Adding, removing, or renaming a key in this file
 * will produce TypeScript errors in any locale that does not match, ensuring
 * all languages stay in sync.
 */

export interface Translations {
  nav: {
    home: string;
    stack: string;
    experience: string;
    education: string;
    contact: string;
  };
  hero: {
    availableBadge: string;
    subtitle: string;
    roleLine: string;
  };
  systemKnowledge: {
    sectionLabel: string;
    coreLanguages: string;
    distributedSystems: string;
    data: string;
    infrastructure: string;
    observability: string;
    buildDev: string;
  };
  about: {
    fullName: string;
    location: string;
  };
  sections: {
    stackSubtitle: string;
    experienceTitle: string;
    experienceSubtitle: string;
    educationTitle: string;
    educationSubtitle: string;
    contactTitle: string;
    contactSubtitle: string;
  };
  contact: {
    intro: string;
    emailMe: string;
    locationLabel: string;
    locationLine: string;
  };
  social: {
    github: string;
    linkedin: string;
  };
  footer: {
    copyright: string;
    email: string;
    builtWith: string;
  };
  locale: {
    selectLanguage: string;
    language: string;
    options: string;
    englishLabel: string;
    hindiLabel: string;
    germanLabel: string;
  };
}
