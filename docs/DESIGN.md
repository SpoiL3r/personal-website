# Personal Website Architecture

Maintainer reference for `vaibhav-singh.in`. Last updated: April 2026.

---

## 1. Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.2 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 + CSS custom properties | ^4 |
| Animation | Framer Motion | ^12 |
| Theming | Custom `ThemeProvider` + CSS variables | local |
| Icons | lucide-react (UI) + react-icons (brand) | ^1.7 / ^5.6 |
| Runtime | React | 19.2.4 |

Fonts are loaded through `next/font/google`: Geist Sans and Geist Mono.

---

## 2. Directory Layout

```text
personal-website/
|-- app/
|   |-- layout.tsx          Root layout, metadata, JSON-LD, skip-to-content
|   |-- page.tsx            Single-page composition
|   |-- globals.css         Theme tokens, component styles, responsive rules
|   |-- sitemap.ts          Static sitemap
|   |-- not-found.tsx       404 page
|   `-- api/
|       |-- chess-stats/    Lichess + Chess.com aggregation
|       |-- gaming-stats/   Steam playtime + manual overrides
|       `-- visitors/       Visitor-country tracking
|-- components/
|   |-- about/              AboutHero, AboutBulletList
|   |-- cards/              ChessCard, GamingCard
|   |-- experience/         ExperienceTimeline
|   |-- home/               HomeHero, SystemKnowledge
|   |-- layout/             Navbar, Footer, ThemeProvider, ThemeToggle
|   |-- locale/             LocaleToggle
|   |-- sections/           Section wrapper, page-level section composition
|   `-- ui/                 ErrorBoundary, CardHeader, LocationFlag
|-- lib/
|   |-- constants/          Profile image URL
|   |-- contexts/           LocaleContext
|   |-- data/               experience.ts, techStack.ts
|   |-- hooks/              useChessStats
|   |-- navigation/         navModel.mjs + navModel.test.mjs
|   |-- locales/            en.ts, hi.ts, de.ts, types.ts
|   `-- rateLimit.ts        In-memory sliding-window rate limiter
`-- public/
    |-- logos/              Local logo assets
    `-- vaibhav_singh_cv.pdf
```

---

## 3. Page Composition

The site is a single scrollable flow:

```tsx
<Home>
  <section id="home">
    <HomeHero />
  </section>
  <Section id="about">
    <AboutHero />
    <SystemKnowledge />
  </Section>
  <ExperienceSection />
  <EducationSection />
  <ExtracurricularSection />
  <ContactSection />
</Home>
```

`Section.tsx` is the shared wrapper for section title, subtitle, scroll-reveal animation, and `prefers-reduced-motion` support.

---

## 4. Providers and State

Provider order in `app/layout.tsx`:

```tsx
<ThemeProvider>
  <LocaleProvider>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </LocaleProvider>
</ThemeProvider>
```

| Provider | State | Persistence |
|---|---|---|
| `ThemeProvider` | Light or dark theme | `localStorage` key `theme` |
| `LocaleProvider` | Active locale and translations | `localStorage` key `preferred-locale` |

Locale changes also update `document.documentElement.lang` for accessibility.

---

## 5. Localization

`lib/locales/types.ts` defines the `Translations` interface. Locale files must satisfy it exactly - missing keys fail at build time.

Namespaces: `nav`, `hero`, `systemKnowledge`, `about`, `experience`, `sections`, `extracurricular`, `contact`, `social`, `footer`, `locale`, `visitors`, `languages`.

---

## 6. Navigation Model

`lib/navigation/navModel.mjs` defines the shared nav model.

- Every primary nav destination resolves to the home page as `/` or `/#section`.
- Scroll-spy tracks the active section via `IntersectionObserver`-style scroll detection.
- Unit tests in `navModel.test.mjs` cover anchor behavior.

---

## 7. API Routes

| Route | Method | Purpose | Caching | Rate Limit |
|---|---|---|---|---|
| `/api/chess-stats` | GET | Lichess + Chess.com aggregation | `revalidate: 3600` | 60 req/min/IP |
| `/api/gaming-stats` | GET | Steam hours + manual overrides | `revalidate: 3600` | 60 req/min/IP |
| `/api/visitors` | GET | Returns stored country codes | `force-dynamic` | 60 req/min/IP |
| `/api/visitors` | POST | Resolves and stores visitor country | `force-dynamic` | 30 req/min/IP |

Rate limiting uses `lib/rateLimit.ts` - a simple in-memory sliding-window counter per IP.

Geo-IP resolution priority: Vercel headers > Cloudflare headers > ipapi.co (HTTPS) > dev fallback.

Environment variables:

| Variable | Required | Purpose |
|---|---|---|
| `STEAM_API_KEY` | No | Steam Web API key. Without it, only manual game overrides are shown. |
| `STEAM_ID` | No | Steam 64-bit user id. |
| `VISITOR_DEV_COUNTRY` | No | Local-dev fallback country code (default: "IN"). |

---

## 8. Theming

Two themes: dark (default) and light.

- Theme tokens are CSS custom properties in `app/globals.css` (`:root` for dark, `html.light` for light).
- Dark: deep navy (#0f1117) with blue accent (#58a6ff).
- Light: clean white (#ffffff) with blue accent (#0969da).
- `ThemeToggle.tsx` uses the View Transitions API for a clip-path reveal animation.
- `suppressHydrationWarning` on `<html>` avoids theme mismatch noise during hydration.
- Game tier colors and chess rating colors adapt to theme via `useTheme()`.

---

## 9. Accessibility and SEO

- Skip-to-content link as first focusable element
- JSON-LD Person structured data
- OpenGraph and Twitter card metadata
- Dynamic `html lang` attribute updates on locale switch
- `--text-dim` color passes WCAG AA contrast (4.5:1)
- `prefers-reduced-motion` disables all CSS animations globally + framer-motion check in Section
- `next/image` for all external images with configured `remotePatterns`
- `suppressHydrationWarning` on both `<html>` and `<body>` to handle browser extension DOM injection

---

## 10. Design Tokens

Consistent values used across the site:

| Token | Value |
|---|---|
| Card border-radius | 18px |
| Small card border-radius (SK) | 12px |
| Button border-radius | 10px |
| Pill/tag border-radius | 999px |
| Card padding | 1.5rem - 1.75rem |
| Section padding | 3.5rem top, 1.5rem bottom |
| Body font | Geist Sans |
| Mono font | Geist Mono |
| Tag/chip style | `sk-chip` class (pill, bg-hover, 0.7rem) |

---

## 11. Known Tech Debt

| Item | File | Notes |
|---|---|---|
| Visitor persistence | `app/api/visitors/route.ts` | File-backed storage degrades to memory on read-only serverless. Migrate to Vercel KV or Upstash. |
| Manual game hours | `app/api/gaming-stats/route.ts` | Overwatch 2 and Valorant hours are hardcoded. |
| Client-side i18n | `lib/contexts/LocaleContext.tsx` | All content is client-rendered due to `useLocale()` in every component. Server components would require route-based i18n. |
| No og:image asset | `public/` | No OG image exists yet. Add `/public/og-image.png` (1200x630) and reference in layout.tsx metadata. |
| Inline styles | Various components | ~50 unique font-size values across inline styles. Gradual migration to CSS classes recommended. |
