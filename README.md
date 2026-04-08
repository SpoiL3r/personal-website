# vaibhav.dev — Personal Website

Personal portfolio for **Vaibhav Singh**, SDE 2 at SAP Labs India.

Built with Next.js 16 App Router, TypeScript, Tailwind CSS v4, and Framer Motion.

---

## Features

- **Live presence widget** — IST-based auto status (working / coffee / lunch / gaming / sleeping) with manual override and India public holiday detection
- **Chess stats** — live ratings from Lichess + Chess.com; top openings aggregated from last 300 rated games
- **Gaming stats** — Steam playtime via API; manual entries for games without public APIs
- **Trophy system** — 10 unlockable achievements tracked in localStorage, platinum celebration on completion
- **i18n** — English, Hindi, German with full type-safe translation coverage
- **Visitor flags** — country-flag strip from server-side IP geolocation
- **Dark / light mode** — IntelliJ-dark palette and a slate light mode, with audio feedback on toggle

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

---

## Local Development

### Prerequisites

- Node.js 20+
- npm / pnpm / yarn

### Setup

```bash
git clone https://github.com/vaibhavsingh97/personal-website.git
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

See `.env.example` for the full list. Required for full functionality:

| Variable | Purpose |
|---|---|
| `STEAM_API_KEY` | Steam Web API key — powers gaming stats |
| `STEAM_ID` | Your Steam 64-bit user ID |
| `VISITOR_DEV_COUNTRY` | ISO-3166 code used as visitor country in local dev (defaults to `IN`) |

Without `STEAM_API_KEY` / `STEAM_ID` the gaming card shows its error fallback. Everything else works without env vars.

---

## Project Structure

```
app/                    # Next.js App Router pages + API routes
├── api/
│   ├── chess-stats/    # Lichess + Chess.com proxy + opening aggregation
│   ├── gaming-stats/   # Steam API + manual game entries
│   ├── holidays/       # India public holidays (Nager.Date + RBI scrape)
│   └── visitors/       # IP geolocation → country code store
components/
├── layout/             # Navbar, Footer, ProfileStatus, ThemeToggle, VisitorFlags
├── sections/           # Page-level content sections
├── cards/              # ChessCard, GamingCard
├── home/               # HomeHero, SystemKnowledge
├── about/              # About section sub-components
├── trophy/             # TrophyHUD, TrophyDropdown, PlatinumCelebration
├── locale/             # LocaleToggle (EN / HI / DE)
└── ui/                 # AnimateIn, ErrorBoundary, Tag, TerminalWindow, etc.
lib/
├── contexts/           # LocaleContext, TrophyContext
├── hooks/              # useProfileStatus, useChessStats, useFetchData
├── data/               # experience.ts, trophies.ts, techStack.ts
└── locales/            # en.ts, hi.ts, de.ts + Translations interface
docs/
└── DESIGN.md           # Architecture reference
```

Full architecture details in [`docs/DESIGN.md`](docs/DESIGN.md).

---

## Deployment

The site is designed to deploy on **Vercel**.

1. Push to GitHub
2. Import into Vercel
3. Set environment variables in the Vercel dashboard (`STEAM_API_KEY`, `STEAM_ID`)
4. Deploy

> **Note:** The visitor country store uses a local JSON file (`data/visitors.json`) that falls back to in-memory on serverless. For persistent visitor tracking across deployments, swap in Upstash Redis or Vercel KV (see `app/api/visitors/route.ts`).

---

## Adding Content

### New experience entry
Edit `lib/data/experience.ts` — add to `EXPERIENCE` array following the `Job` interface.

### New translation key
1. Add to `lib/locales/types.ts`
2. Add to `lib/locales/en.ts`, `hi.ts`, `de.ts`
3. Use via `const { t } = useLocale(); t.<namespace>.<key>`

### New trophy
1. Add entry to `lib/data/trophies.ts`
2. Add title + description keys to all locale files
3. Call `unlock("your_id")` from the relevant component

---

## License

MIT
