<h1 align="center">vaibhav-singh.in</h1>

<p align="center">Personal portfolio and engineering profile for <strong>Vaibhav Singh</strong>.</p>

<p align="center">
  <a href="https://vaibhav-singh.in"><img src="https://img.shields.io/badge/live-vaibhav--singh.in-0f766e?style=flat-square" alt="Live site" /></a>
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

This repository contains a production Next.js portfolio site focused on:

- presenting backend and platform engineering experience clearly
- combining static portfolio content with a small set of live data integrations
- supporting multiple locales without losing type safety
- keeping the site visually polished without turning the experience into a gimmick

The site is intentionally opinionated: it is a personal portfolio, but it is built with the same quality bar applied to product work. The codebase prioritizes maintainability, predictable data flow, and clear separation between content, presentation, and external integrations.

## Highlights

- One-page portfolio flow with dedicated sections for profile, experience, education, extracurriculars, and contact
- Type-safe internationalization for English, Hindi, and German
- Live gaming and chess cards backed by server routes
- Lightweight achievement system persisted in `localStorage`
- Sitemap generation and crawl-friendly metadata
- Theme support and responsive layout across desktop and mobile

## Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Animation | Framer Motion |
| Theme | `next-themes` |
| Icons | `lucide-react`, `react-icons` |
| Deployment | Vercel |

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

Create a local environment file:

```bash
cp .env.example .env.local
```

Start the dev server:

```bash
npm run dev
```

Run quality checks:

```bash
npm run lint
npm run build
```

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `STEAM_API_KEY` | Yes | Steam Web API key used by `/api/gaming-stats` |
| `STEAM_ID` | Yes | Steam 64-bit account ID used for gaming data |
| `VISITOR_DEV_COUNTRY` | No | Local development fallback for visitor-country tracking |

Without the Steam variables, the gaming widget falls back to its error state. The rest of the site still works.

## Project Structure

```text
app/
  api/
    chess-stats/        Lichess + Chess.com aggregation
    gaming-stats/       Steam playtime aggregation + manual overrides
    holidays/           India public holiday data
    visitors/           Visitor-country tracking
  about/                Redirects to /#about
  blog/                 Placeholder route
  sitemap.ts            Sitemap generator

components/
  about/                About section and supporting UI
  cards/                Chess and gaming cards
  experience/           Experience timeline
  home/                 Hero and system-knowledge sections
  layout/               Navbar, footer, theme toggle, visitor widget
  locale/               Locale switcher
  sections/             Page-level section composition
  trophy/               Trophy HUD and celebration UI
  ui/                   Shared primitives

lib/
  constants/            Shared constants such as profile image source
  contexts/             Locale and trophy state
  data/                 Static content and configuration
  hooks/                Client hooks for external data
  locales/              Translation dictionaries and types

docs/
  DESIGN.md             Architecture and design notes
```

## External Integrations

### Chess

`/api/chess-stats` aggregates:

- Lichess ratings and recent opening data
- Chess.com ratings

The route returns a normalized payload so the UI remains simple and presentation-focused.

### Gaming

`/api/gaming-stats` combines:

- Steam-owned game playtime for configured titles
- manual overrides for games without a reliable public API

### Visitors

`/api/visitors` records unique visitor countries. It prefers platform-provided geo headers and falls back to a simple IP lookup when necessary. Persistence is file-based with an in-memory fallback for restricted environments.

## Content Model

The site keeps content in code instead of a CMS on purpose.

- professional experience and education live in `lib/data/experience.ts`
- skills and technology categories live in `lib/data/techStack.ts`
- translation strings live in `lib/locales/*.ts`

This keeps the project easy to review, version, and refactor without introducing content-management overhead.

## Design Notes

The current visual direction is designed around:

- restrained motion
- consistent interaction hierarchy
- strong typography and spacing
- subtle glass/card surfaces without noisy chrome

The goal is to feel like a high-quality engineering portfolio rather than a generic template or novelty microsite.

Detailed architecture notes are in [docs/DESIGN.md](docs/DESIGN.md).

## Deployment

The site is deployed on Vercel. A typical flow is:

1. open a feature branch
2. push changes
3. create a PR into `main`
4. let Vercel build the preview and production deployments

## License

MIT
