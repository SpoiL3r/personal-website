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
    about: string;
    experience: string;
    education: string;
    offClock: string;
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
    tagline: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
    bullet4: string;
  };
  sections: {
    aboutTitle: string;
    aboutSubtitle: string;
    experienceTitle: string;
    experienceSubtitle: string;
    educationTitle: string;
    educationSubtitle: string;
    extracurricularTitle: string;
    extracurricularSubtitle: string;
    contactTitle: string;
    contactSubtitle: string;
  };
  extracurricular: {
    gaming: string;
    chess: string;
    offScreen: string;
    swimming: string;
    tableTennis: string;
    gym: string;
    badminton: string;
    liveFromSteam: string;
    updatedDaily: string;
    failedToLoadStats: string;
    tierObsessed: string;
    tierDedicated: string;
    tierRegular: string;
    tierCasual: string;
    bullet: string;
    blitz: string;
    rapid: string;
    liveFromChess: string;
    updatedHourly: string;
    favouriteOpenings: string;
    asWhite: string;
    asBlack: string;
    gamesSuffix: string;
    failedToLoad: string;
  };
  contact: {
    intro: string;
    emailMe: string;
    downloadResume: string;
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
