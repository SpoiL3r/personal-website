# Personal Website Architecture

Maintainer reference for `vaibhav-singh.in`. Last updated: April 2026.

---

## 1. Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.2 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 | ^4 |
| Animation | Framer Motion | ^12 |
| Theming | next-themes | ^0.4.6 |
| Icons | lucide-react + react-icons | ^1.7 / ^5.6 |
| Runtime | React | 19.2.4 |

Fonts are loaded through `next/font/google`: Geist Sans, Geist Mono, Caveat, and Instrument Serif.

---

## 2. Directory Layout

```text
personal-website/
|-- app/
|   |-- layout.tsx
|   |-- page.tsx
|   |-- globals.css
|   |-- about/page.tsx
|   |-- experience/page.tsx
|   |-- blog/page.tsx
|   `-- api/
|       |-- chess-stats/
|       |-- gaming-stats/
|       `-- visitors/
|-- components/
|   |-- about/
|   |-- cards/
|   |-- experience/
|   |-- home/
|   |-- layout/
|   |-- locale/
|   |-- sections/
|   |-- trophy/
|   `-- ui/
|-- data/
|   `-- visitors.json
|-- docs/
|   `-- DESIGN.md
|-- lib/
|   |-- constants/
|   |-- contexts/
|   |-- data/
|   |-- hooks/
|   `-- locales/
`-- public/
    `-- logos/
```

The repository is intentionally section-oriented: content components live in `components/`, typed content in `lib/data/`, and server-side integrations in `app/api/`.

---

## 3. Page Composition

The home page is a single scrollable flow:

```tsx
<Home>
  <section id="home">
    <HomeHero />
  </section>
  <ExperienceSection />
  <Section id="about">
    <AboutHero compact />
    <SystemKnowledge />
  </Section>
  <EducationSection />
  <ExtracurricularSection />
  <ContactSection />
</Home>
```

`components/sections/Section.tsx` is the shared wrapper for section title, subtitle, and body layout.

Global overlays mounted from `app/layout.tsx`:

| Overlay | Purpose |
|---|---|
| `TrophyHUD` | Fixed top-right trophy entry point |
| `PlatinumCelebration` | Full-screen 100 percent completion modal |
| `VisitorFlags` | Records and renders visitor country flags |

---

## 4. Providers and State

Provider order in `app/layout.tsx`:

```tsx
<ThemeProvider>
  <TrophyProvider>
    <LocaleProvider>
      ...app
    </LocaleProvider>
  </TrophyProvider>
</ThemeProvider>
```

| Provider | State | Persistence |
|---|---|---|
| `ThemeProvider` | Light or dark theme | next-themes managed local storage |
| `TrophyProvider` | Unlocked trophy ids | `localStorage` key `unlocked-trophies` |
| `LocaleProvider` | Active locale and translations | `localStorage` key `preferred-locale` |

Custom providers use lazy initialization and guard browser-only access with `typeof window === "undefined"`.

---

## 5. Localization

`lib/locales/types.ts` defines the complete `Translations` interface. Locale files in `lib/locales/` must satisfy it exactly, so missing keys fail at build time.

Namespaces currently used:

- `nav`
- `hero`
- `career`
- `systemKnowledge`
- `about`
- `experience`
- `sections`
- `extracurricular`
- `contact`
- `social`
- `footer`
- `blog`
- `locale`
- `visitors`
- `languages`
- `trophies`

Consumption pattern:

```ts
const { t, locale, setLocale } = useLocale();
```

---

## 6. Trophy System

Trophy definitions live in `lib/data/trophies.ts`.

- `full_profile` is the meta trophy.
- `FULL_PROFILE_THRESHOLD = 9`.
- `first_visit` is awarded automatically from `TrophyContext`.

Current unlock points:

| Trophy | Trigger |
|---|---|
| `about_explorer` | About section enters view |
| `exp_deep_dive` | Final experience timeline row enters view |
| `tech_curious` | System Knowledge section interaction |
| `chess_fan` | Chess card viewed |
| `gaming_fan` | Gaming card viewed |
| `linkedin_stalker` | LinkedIn link clicked |
| `github_hunter` | GitHub link clicked |
| `mail_sender` | Mail or contact link clicked |
| `resume_downloader` | Resume downloaded |
| `full_profile` | Auto-awarded after 9 non-meta trophies |

UI flow:

```text
TrophyHUD
`-- TrophyDropdown
    `-- TrophyItem x N

PlatinumCelebration
```

---

## 7. API Routes

| Route | Method | Purpose | Caching |
|---|---|---|---|
| `/api/chess-stats` | GET | Lichess and Chess.com aggregation | `revalidate: 3600` |
| `/api/gaming-stats` | GET | Steam hours plus manual overrides | `revalidate: 3600` |
| `/api/visitors` | GET | Returns sorted stored country codes | `force-dynamic` |
| `/api/visitors` | POST | Resolves and stores visitor country | `force-dynamic` |

Environment variables:

| Variable | Purpose |
|---|---|
| `STEAM_API_KEY` | Steam Web API key |
| `STEAM_ID` | Steam 64-bit user id |
| `VISITOR_DEV_COUNTRY` | Local-dev fallback country code |

---

## 8. Theming

- Theme tokens live in `app/globals.css`.
- `html.light` overrides the dark defaults.
- `ThemeToggle.tsx` adds the UI control and audio feedback.
- `suppressHydrationWarning` is applied at the `<html>` level to avoid theme mismatch noise during hydration.

---

## 9. Error Handling

`components/ui/ErrorBoundary.tsx` wraps API-driven surfaces that can fail independently.

Current boundary usage:

- `ChessCard`
- `GamingCard`
- `VisitorFlags`

Each data-driven component also renders a localized inline fallback before an error boundary is needed.

---

## 10. Known Tech Debt

| Item | File | Notes |
|---|---|---|
| Visitor persistence | `app/api/visitors/route.ts` | File-backed storage degrades to memory on read-only serverless runtimes |
| Manual game hours | `app/api/gaming-stats/route.ts` | Overwatch 2 and Valorant hours are still hardcoded |
