# Personal Website — Architecture & Design

Maintainer reference for `vaibhav.dev`. Last updated: April 2026.

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
| Runtime | React 19 | 19.2.4 |

Fonts loaded via `next/font/google`: **Geist Sans** (`--font-geist-sans`), **Geist Mono** (`--font-geist-mono`), **Caveat** (`--font-signature`, 700 — used for handwritten signature), **Instrument Serif** (`--font-display`, 400 normal+italic).

---

## 2. Directory Layout

```
personal-website/
├── app/
│   ├── layout.tsx          # Root layout — providers, Navbar, Footer, overlays
│   ├── page.tsx            # Single-page composition (all home sections)
│   ├── globals.css         # Tailwind base + CSS custom properties + animations
│   ├── not-found.tsx       # Custom 404 page
│   ├── about/page.tsx      # /about route
│   ├── experience/page.tsx # /experience route
│   ├── blog/page.tsx       # /blog route
│   └── api/
│       ├── chess-stats/    # Lichess + Chess.com ratings + live opening aggregation
│       ├── gaming-stats/   # Steam hours + manual game overrides
│       ├── holidays/       # India public holidays + RBI Bengaluru bank holidays
│       └── visitors/       # Country-flag visitor tracking (file-backed)
│
├── components/
│   ├── layout/             # Structural chrome — always visible
│   │   ├── Navbar.tsx          # Sticky top nav with scroll-spy
│   │   ├── Footer.tsx          # Site footer
│   │   ├── ThemeProvider.tsx   # Wraps next-themes <ThemeProvider>
│   │   ├── ThemeToggle.tsx     # Dark/light toggle with audio feedback
│   │   ├── ProfileStatus.tsx   # Fixed avatar + presence pill (owner-only panel)
│   │   ├── StatusPanel.tsx     # Settings dropdown (auto/manual/holiday) — localhost only
│   │   ├── TabBar.tsx          # Mobile bottom tab bar
│   │   └── VisitorFlags.tsx    # Country flag strip; fires POST /api/visitors on mount
│   │
│   ├── sections/           # Page-level content sections
│   │   ├── Section.tsx             # Generic titled section wrapper
│   │   ├── ExperienceSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── ExtracurricularSection.tsx  # Hosts GamerSection + ChessCard + GamingCard
│   │   ├── ContactSection.tsx
│   │   └── GamerSection.tsx        # Gaming identity + social links + Steam cards
│   │
│   ├── home/               # Components specific to the home page
│   │   ├── HomeHero.tsx        # Landing hero card
│   │   └── SystemKnowledge.tsx # 6-category tech skill grid
│   │
│   ├── about/              # Components specific to the About section
│   │   ├── AboutHero.tsx
│   │   ├── AboutIdentityHeader.tsx
│   │   ├── AboutMetaRow.tsx
│   │   ├── AboutSocialLinks.tsx
│   │   └── AboutBulletList.tsx
│   │
│   ├── experience/
│   │   └── ExperienceTimeline.tsx  # Timeline rendering (data from lib/data/experience.ts)
│   │
│   ├── cards/              # Domain-specific data-display cards
│   │   ├── ChessCard.tsx       # Live chess ratings + opening stats
│   │   └── GamingCard.tsx      # Per-game Steam hours bar
│   │
│   ├── trophy/             # Achievement system UI
│   │   ├── TrophyHUD.tsx           # Fixed overlay trigger (top-right)
│   │   ├── TrophyDropdown.tsx      # Flyout panel listing all trophies
│   │   ├── TrophyItem.tsx          # Single trophy row (locked/unlocked)
│   │   └── PlatinumCelebration.tsx # Full-screen modal for 100% completion
│   │
│   ├── locale/
│   │   └── LocaleToggle.tsx    # EN / HI / DE language switcher
│   │
│   └── ui/                 # Generic reusable primitives
│       ├── AnimateIn.tsx       # Framer Motion scroll-reveal wrapper
│       ├── CardHeader.tsx
│       ├── ErrorBoundary.tsx   # Class-based error boundary (wraps API cards)
│       ├── LocationFlag.tsx
│       ├── SectionLabel.tsx
│       ├── SkillBars.tsx
│       ├── SkillsGrid.tsx
│       ├── Tag.tsx
│       ├── TerminalDivider.tsx
│       └── TerminalWindow.tsx
│
├── lib/
│   ├── contexts/           # React context providers + hooks
│   │   ├── LocaleContext.tsx   # i18n provider + useLocale() hook
│   │   └── TrophyContext.tsx   # Trophy state provider + useTrophies() hook
│   │
│   ├── hooks/              # Client-side React hooks
│   │   ├── useChessStats.ts    # Fetches /api/chess-stats with AbortController
│   │   ├── useFetchData.ts     # Generic fetch hook (loading/error/cancel)
│   │   └── useProfileStatus.ts # IST schedule + holiday logic for ProfileStatus
│   │
│   ├── data/               # Static typed data
│   │   ├── experience.ts       # EXPERIENCE[] + EDUCATION[] + Job interface
│   │   ├── trophies.ts         # TROPHIES[] + FULL_PROFILE_THRESHOLD
│   │   └── techStack.ts        # CATEGORIES[] for SystemKnowledge grid
│   │
│   └── locales/            # i18n translation files
│       ├── types.ts        # Translations interface — single source of truth
│       ├── en.ts
│       ├── hi.ts
│       └── de.ts
│
├── docs/
│   └── DESIGN.md           # This file
│
├── public/
│   └── logos/              # Company/university logo images
│
└── data/
    └── visitors.json       # Persisted visitor country codes (git-ignored on prod)
```

---

## 3. Page Composition

The home page (`app/page.tsx`) is a **single scrollable page** composed of sequential sections. DOM order (which must match the Navbar `NAV` array for scroll-spy to work correctly):

```
<Home>
  <section id="home">   <HomeHero />                    # hero card
  <ExperienceSection />                                  # id="experience"
  <Section id="about">
    <AboutHero compact />
    <SystemKnowledge />
  </Section>
  <EducationSection />                                   # id="education"
  <ExtracurricularSection />                             # id="extracurricular"
  <ContactSection />                                     # id="contact"
```

**`Section`** (`components/sections/Section.tsx`) is the generic layout primitive used by all content sections: renders `<section id>` with a `SectionLabel`, `h2` title, subtitle, then `children`.

All sections read translations via `const { t } = useLocale()` — no hardcoded strings in JSX.

**Global overlays** (in `app/layout.tsx`, outside `<main>`):

| Overlay | Position | Notes |
|---|---|---|
| `<ProfileStatus />` | Fixed, top-left | Owner panel gated to localhost |
| `<TrophyHUD />` | Fixed, top-right | Opens TrophyDropdown |
| `<PlatinumCelebration />` | Full-screen modal | Mounts when `full_profile` unlocks |
| `<VisitorFlags />` | Invisible on mount | POSTs visitor country, renders flag strip |

---

## 4. Providers & Global State

Provider nesting order in `app/layout.tsx`:

```
<ThemeProvider>           ← next-themes
  <TrophyProvider>        ← lib/contexts/TrophyContext
    <LocaleProvider>      ← lib/contexts/LocaleContext
      ...app
```

| Provider | Source | State held | Persistence |
|---|---|---|---|
| `ThemeProvider` | `next-themes` | `"light"` \| `"dark"` | System pref / `localStorage` (next-themes managed) |
| `TrophyProvider` | `lib/contexts/TrophyContext.tsx` | `Set<string>` of unlocked IDs | `localStorage` key `unlocked-trophies` |
| `LocaleProvider` | `lib/contexts/LocaleContext.tsx` | `"en"` \| `"hi"` \| `"de"` + active `Translations` dict | `localStorage` key `preferred-locale` |

Both custom providers use a **lazy `useState` initialiser** gated with `typeof window === "undefined"` for SSR safety.

---

## 5. i18n System

`lib/locales/types.ts` defines the **`Translations` interface** — the single source of truth for every string key. Namespaces: `nav`, `hero`, `status`, `career`, `systemKnowledge`, `about`, `experience`, `sections`, `extracurricular`, `contact`, `social`, `footer`, `blog`, `locale`, `visitors`, `languages`, `trophies`.

Three language files (`en.ts`, `hi.ts`, `de.ts`) satisfy `Translations`. TypeScript enforces completeness at compile time.

### Hook

```ts
const { t, locale, setLocale } = useLocale();
// t.nav.home, t.sections.aboutTitle, etc.
```

### Adding a new key (3 steps)

1. `lib/locales/types.ts` — add to the relevant namespace in `Translations`
2. `lib/locales/en.ts` + `hi.ts` + `de.ts` — add translated string to all three (TS errors until complete)
3. Component — consume via `t.<namespace>.<key>`

### Adding a new language (4 steps)

1. Add code to `Locale` union in `lib/contexts/LocaleContext.tsx`
2. Create `lib/locales/<code>.ts` satisfying `Translations`
3. Register in `DICTIONARIES` map in `LocaleContext.tsx`
4. Add UI option to `components/locale/LocaleToggle.tsx`

---

## 6. Trophy System

### Data (`lib/data/trophies.ts`)

10 trophies as `Trophy[]`. Each has `id`, `icon` (emoji), `titleKey` / `descKey` (typed keys into `Translations["trophies"]`).

Special trophy: `full_profile` — platinum completion.
Threshold: `FULL_PROFILE_THRESHOLD = 8`.

### State (`lib/contexts/TrophyContext.tsx`)

- `unlockedIds: Set<string>` — persisted to `localStorage` key `unlocked-trophies`
- `first_visit` added automatically on every `getInitialTrophies()` call
- `unlock(id)` — idempotent; auto-adds `full_profile` when non-meta count ≥ 8

### Unlock call sites

| Trophy ID | Triggered when |
|---|---|
| `first_visit` | Automatically on every page load |
| `about_explorer` | About section viewed |
| `exp_deep_dive` | Experience timeline expanded |
| `tech_curious` | SystemKnowledge grid hovered |
| `chess_fan` | ChessCard viewed |
| `gaming_fan` | GamingCard / GamerSection viewed |
| `linkedin_stalker` | LinkedIn link clicked |
| `github_hunter` | GitHub link clicked |
| `mail_sender` | Email / Contact link clicked |
| `full_profile` | Auto — 8+ other trophies unlocked |

### UI flow

```
TrophyHUD (fixed, top-right)
  └── TrophyDropdown
        └── TrophyItem × 10
PlatinumCelebration (full-screen modal)
```

---

## 7. Status / Presence System

Split across two files after refactor:

| File | Responsibility |
|---|---|
| `lib/hooks/useProfileStatus.ts` | All state, effects, IST helpers, localStorage, holiday merge |
| `components/layout/ProfileStatus.tsx` | Avatar + pill rendering, statusMap (needs `t`), open/close logic |
| `components/layout/StatusPanel.tsx` | Owner-only settings panel JSX (pure props) |

### Modes

| Mode | Behaviour |
|---|---|
| `auto` | Status derived from IST time every 60 s; holidays override to `vacation` |
| `manual` | Owner picks `StatusId` from dropdown; stored in `localStorage` |

Settings panel visible only on `localhost` / `127.0.0.1`. Keyboard shortcut: `Ctrl/Cmd + Shift + S`.

### Auto-mode IST schedule (weekdays)

| Time (IST) | Status | Presence |
|---|---|---|
| 00:00 – 07:00 | `sleeping` | `offline` |
| 07:00 – 08:30 | `learning` | `available` |
| 08:30 – 09:00 | `available` | `available` |
| 09:00 – 09:30 | `working` | `busy` |
| 09:30 – 10:00 | `coffee` | `away` |
| 10:00 – 12:00 | `working` | `busy` |
| 12:00 – 13:00 | `lunch` | `away` |
| 13:00 – 17:00 | `working` | `busy` |
| 17:00 – 19:00 | `available` | `available` |
| 19:00 – 24:00 | `cs2` / `overwatch` (alternates) | `dnd` |

Weekends: sleeping → learning → gaming → available flow. Holidays → `vacation`.

### localStorage keys

| Key | Purpose |
|---|---|
| `vs-status-mode` | `"auto"` \| `"manual"` |
| `vs-manual-status` | Active `StatusId` in manual mode |
| `vs-holiday-dates` | JSON array of ISO date strings (owner-flagged holidays) |

---

## 8. API Routes

| Route | Method | Purpose | Caching |
|---|---|---|---|
| `/api/chess-stats` | GET | Lichess + Chess.com ratings; last 300 rated games aggregated for live opening stats | `revalidate: 3600` (1 h) |
| `/api/gaming-stats` | GET | Steam `GetOwnedGames` for configured app IDs + manual game overrides | `revalidate: 3600` (1 h) |
| `/api/holidays` | GET | India national holidays (Nager.Date) + Bengaluru bank holidays (RBI HTML scrape) | `revalidate: 43200` (12 h), `runtime: nodejs` |
| `/api/visitors` | GET | Returns sorted list of stored country codes | `force-dynamic` |
| `/api/visitors` | POST | Resolves country (Vercel header → CF header → ip-api.com → `VISITOR_DEV_COUNTRY` env) and upserts | `force-dynamic` |

**Visitor storage:** flat JSON at `data/visitors.json`. Fails silently on read-only serverless — state lives in module-level `memoryCache`. Upstash / Vercel KV is the upgrade path.

**Environment variables:**

| Variable | Purpose |
|---|---|
| `STEAM_API_KEY` | Steam Web API key |
| `STEAM_ID` | Steam 64-bit user ID |
| `VISITOR_DEV_COUNTRY` | ISO-3166 fallback for local dev (defaults to `"IN"`) |

---

## 9. Theming

- `next-themes` manages the `light` / `dark` class on `<html>`
- `suppressHydrationWarning` on `<html>` prevents SSR mismatch from deferred theme resolution
- CSS custom properties declared in `app/globals.css`, toggled by `html.light` selector
- **Dark:** IntelliJ "New UI" dark palette (`--bg: #1e1f22`, accent teal `#00c9b1`)
- **Light:** medium slate palette (`--bg: #d4d8e6`, cards `--bg-card: #e6e9f5`) — reduced brightness intentionally to avoid washed-out cards
- `ThemeToggle.tsx` plays a WebAudio click on toggle
- Theme-aware inline styles use `useTheme()` → `resolvedTheme` to select light/dark tokens at runtime

---

## 10. Error Handling

API-dependent components are wrapped in `<ErrorBoundary>` (class component in `components/ui/ErrorBoundary.tsx`):

- `<ChessCard>` — inside `ExtracurricularSection`
- `<GamingCard>` — inside `ExtracurricularSection`
- `<VisitorFlags>` — in `app/layout.tsx`

Each component also has its own `error` state that renders a localised `// failed to load` fallback before a boundary is needed.

---

## 11. Known Tech Debt

| Item | File | Notes |
|---|---|---|
| Visitor persistence | `app/api/visitors/route.ts` | File-based JSON silently degrades to in-memory on serverless. Swap to Upstash Redis / Vercel KV before scaled production deployment. |
| Manual game hours | `app/api/gaming-stats/route.ts` | Overwatch 2 and Valorant hours are hardcoded — no public API. Update `MANUAL_GAMES` manually when needed. |
