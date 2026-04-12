<h1 align="center">vaibhav-singh.in</h1>

<p align="center">Personal portfolio for <strong>Vaibhav Singh</strong> - Software Engineer at SAP.</p>

<p align="center">
  <a href="https://vaibhav-singh.in"><img src="https://img.shields.io/badge/live-vaibhav--singh.in-0969da?style=flat-square" alt="Live site" /></a>
  <a href="https://vercel.com/spoil3rs-projects/personal-website"><img src="https://img.shields.io/github/deployments/SpoiL3r/personal-website/production?label=vercel&logo=vercel&style=flat-square" alt="Vercel deployment" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-16a34a?style=flat-square" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
</p>

## Overview

Single-page portfolio built with Next.js 16, focused on presenting backend engineering experience clearly. Combines static content with live data integrations (Steam, Lichess, Chess.com) and supports English, Hindi, and German.

## Highlights

- One-page flow: hero, about, experience timeline, education, extracurriculars, contact
- Type-safe i18n (EN/HI/DE) with build-time key validation
- Live gaming stats (Steam API) and chess ratings (Lichess + Chess.com)
- Dark/light theme with View Transitions API reveal animation
- Rate-limited API routes with HTTPS geo-IP lookup
- Accessibility: skip-to-content, WCAG AA contrast, dynamic `lang` attribute
- SEO: JSON-LD Person schema, OpenGraph/Twitter cards, static sitemap

## Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Animation | Framer Motion |
| Icons | lucide-react (UI), react-icons (brand) |
| Deployment | Vercel |

## Local Development

```bash
git clone https://github.com/SpoiL3r/personal-website.git
cd personal-website
npm install
cp .env.example .env.local
npm run dev
```

Quality checks:

```bash
npm test        # navModel unit tests
npm run lint    # ESLint
npm run build   # production build
```

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `STEAM_API_KEY` | No | Steam Web API key for `/api/gaming-stats` |
| `STEAM_ID` | No | Steam 64-bit account ID |
| `VISITOR_DEV_COUNTRY` | No | Local dev fallback for visitor tracking (default: "IN") |

Without Steam variables, the gaming card shows manual overrides only. The rest of the site works fully.

## Project Structure

```text
app/                    Pages, API routes, global styles
components/             UI components organized by section
lib/                    Contexts, data, hooks, locales, utilities
docs/                   Architecture notes (DESIGN.md)
public/                 Static assets
```

See [docs/DESIGN.md](docs/DESIGN.md) for detailed architecture documentation.

## License

MIT
