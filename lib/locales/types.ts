/**
 * @file types.ts
 * @description Single source of truth for all translation keys used across the site.
 *
 * Every locale file (en.ts, hi.ts, de.ts) must satisfy the `Translations`
 * interface defined here. Adding, removing, or renaming a key in this file
 * will produce TypeScript errors in any locale that does not match, ensuring
 * all languages stay in sync.
 *
 * Exports:
 *  - `Translations` — complete i18n shape; import this type wherever
 *                     a fully-typed translation dictionary is needed.
 */

/**
 * Complete translation dictionary shape.
 *
 * Each top-level property groups strings by site section (e.g. `nav`, `hero`,
 * `trophies`). Locale files export a value of this type to guarantee coverage.
 */
export interface Translations {
  nav: {
    home: string;
    about: string;
    experience: string;
    education: string;
    offClock: string;
    blog: string;
    contact: string;
  };
  hero: {
    availableBadge: string;
    currentRole: string;
    currentCompany: string;
    workingOn: string;
    subtitle: string;
    greeting: string;
    roleLine: string;
    currentlyAt: string;
  };
  career: {
    sectionLabel: string;
    fullTimeline: string;
    current: string;
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
    sectionLabel: string;
    fullName: string;
    role: string;
    location: string;
    pronouns: string;
    tagline: string;
    experienceBadge: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
    bullet4: string;
    getInTouch: string;
    getInTouchBody: string;
    education: string;
    funFactFuelLabel: string;
    funFactFuelValue: string;
    funFactHobbyLabel: string;
    funFactHobbyValue: string;
    funFactLivedInLabel: string;
    funFactLivedInValue: string;
    funFactSideEffectLabel: string;
    funFactSideEffectValue: string;
    mastersSchool: string;
    mastersDegree: string;
    mastersMeta: string;
    bachelorsSchool: string;
    bachelorsDegree: string;
    bachelorsMeta: string;
    contactLead: string;
    contactOrFind: string;
  };
  experience: {
    sectionLabel: string;
    pageTitle: string;
    pageSubtitle: string;
    highlights: string;
    techUsed: string;
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
    currentlyPlaying: string;
    active: string;
    hoursShort: string;
    genreGeneric: string;
    tacticalFps: string;
    battleRoyale: string;
    heroShooter: string;
  };
  contact: {
    emailMe: string;
    downloadResume: string;
    locationLine: string;
    findMeOn: string;
  };
  social: {
    x: string;
    twitterX: string;
    github: string;
    linkedin: string;
    steam: string;
    discord: string;
    copied: string;
  };
  footer: {
    copyright: string;
    github: string;
    linkedin: string;
    email: string;
    builtWith: string;
  };
  blog: {
    title: string;
    intro: string;
    comingSoon: string;
    firstPost: string;
  };
  locale: {
    selectLanguage: string;
    language: string;
    options: string;
    englishLabel: string;
    hindiLabel: string;
    germanLabel: string;
  };
  visitors: {
    label: string;
    more: string;
  };
  languages: {
    sectionLabel: string;
    english: string;
    hindi: string;
    german: string;
    levelNative: string;
    levelFullProfessional: string;
    levelLimitedWorking: string;
  };
  trophies: {
    hudLabel: string;
    countLabel: string;
    panelTitle: string;
    replayLabel: string;
    first_visit_title: string;
    first_visit_desc: string;
    about_explorer_title: string;
    about_explorer_desc: string;
    exp_deep_dive_title: string;
    exp_deep_dive_desc: string;
    tech_curious_title: string;
    tech_curious_desc: string;
    chess_fan_title: string;
    chess_fan_desc: string;
    gaming_fan_title: string;
    gaming_fan_desc: string;
    linkedin_stalker_title: string;
    linkedin_stalker_desc: string;
    github_hunter_title: string;
    github_hunter_desc: string;
    mail_sender_title: string;
    mail_sender_desc: string;
    resume_downloader_title: string;
    resume_downloader_desc: string;
    full_profile_title: string;
    full_profile_desc: string;
    locked: string;
    unlocked: string;
    progress: string;
    platinumTitle: string;
    platinumBody: string;
    platinumClaim: string;
    platinumClose: string;
    platinumComplete: string;
  };
}
