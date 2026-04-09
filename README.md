<h1 align="center">vaibhav-singh.in</h1>

<p align="center">Personal portfolio of <strong>Vaibhav Singh</strong> - Software Engineer at SAP Labs India.</p>

<p align="center">
  <a href="https://vaibhav-singh.in"><img src="https://img.shields.io/badge/live-vaibhav--singh.in-6366f1?style=flat-square" alt="Live" /></a>
  <a href="https://vercel.com/spoil3rs-projects/personal-website"><img src="https://img.shields.io/github/deployments/SpoiL3r/personal-website/production?label=vercel&logo=vercel&style=flat-square" alt="Vercel" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://www.framer.com/motion"><img src="https://img.shields.io/badge/Framer_Motion-12-ff0055?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" /></a>
</p>

---

## Features

| Feature | Description |
|---|---|
| Live presence widget | IST-based auto status (working / coffee / lunch / gaming / sleeping) with manual override and India public holiday detection |
| Chess stats | Live ratings from Lichess + Chess.com with top openings aggregated from last 300 rated games |
| Gaming stats | Steam playtime via API with tier labels; manual entries for games without public APIs |
| Trophy system | 11 unlockable achievements tracked in localStorage, platinum celebration on completion |
| i18n | English, Hindi, German with full type-safe translation coverage |
| Visitor flags | Country-flag strip from server-side IP geolocation |
| Resume download | Direct PDF download with trophy unlock |
| Dark / light mode | IntelliJ-dark palette and a slate light mode, with audio feedback on toggle |

---

## Stack

| | |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Animation | Framer Motion 12 |
| Theming | next-themes |
| Icons | lucide-react, react-icons |
| Runtime | React 19 |
| Deployment | Vercel |

---

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone https://github.com/SpoiL3r/personal-website.git
cd personal-website
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env.local
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `STEAM_API_KEY` | Steam Web API key - powers gaming stats | Yes |
| `STEAM_ID` | Your Steam 64-bit user ID | Yes |
| `VISITOR_DEV_COUNTRY` | ISO-3166 code used as visitor country in local dev (defaults to `IN`) | No |

Get your Steam API key at [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey).
Find your Steam64 ID at [steamidfinder.com](https://steamidfinder.com).

Without `STEAM_API_KEY` / `STEAM_ID` the gaming card shows its error fallback. Everything else works without env vars.

---

## Project Structure

```
app/                        # Next.js App Router pages + API routes
- api/
  - chess-stats/            # Lichess + Chess.com proxy + opening aggregation
  - gaming-stats/           # Steam API + manual game entries
  - holidays/               # India public holidays (Nager.Date + RBI scrape)
  - visitors/               # IP geolocation -> country code store
components/
- layout/                   # Navbar, Footer, ProfileStatus, StatusPanel, ThemeToggle, VisitorFlags
- sections/                 # Page-level content sections
- cards/                    # ChessCard, GamingCard
- home/                     # HomeHero, SystemKnowledge
- about/                    # About section sub-components
- trophy/                   # TrophyHUD, TrophyDropdown, PlatinumCelebration
- locale/                   # LocaleToggle (EN / HI / DE)
- ui/                       # AnimateIn, ErrorBoundary, Tag, TerminalWindow, etc.
lib/
- contexts/                 # LocaleContext, TrophyContext
- hooks/                    # useProfileStatus, useChessStats, useFetchData
- data/                     # experience.ts, trophies.ts, techStack.ts
- locales/                  # en.ts, hi.ts, de.ts + Translations interface
docs/
- DESIGN.md                 # Architecture reference
```

Full architecture details in [`docs/DESIGN.md`](docs/DESIGN.md).

---

## Adding Content

### New experience entry

Edit [lib/data/experience.ts](lib/data/experience.ts) and add to the `EXPERIENCE` array following the `Job` interface.

### New translation key

1. Add to [lib/locales/types.ts](lib/locales/types.ts)
2. Add to `en.ts`, `hi.ts`, `de.ts`
3. Use via `const { t } = useLocale(); t.<namespace>.<key>`

### New trophy

1. Add entry to [lib/data/trophies.ts](lib/data/trophies.ts)
2. Add title + description keys to all locale files
3. Call `unlock("your_id")` from the relevant component

---

## Deployment

Deployed on **Vercel** with automatic deployments on every merge to `main`.

Branch protection is enabled - all changes must go through a pull request.

### Deploy your own

1. Fork the repo
2. Import into Vercel
3. Set `STEAM_API_KEY` and `STEAM_ID` environment variables
4. Deploy

> **Note:** The visitor country store uses a local JSON file (`data/visitors.json`) that falls back to in-memory on serverless. For persistent visitor tracking across deployments, swap in Upstash Redis or Vercel KV (see `app/api/visitors/route.ts`).

---

## License

MIT
