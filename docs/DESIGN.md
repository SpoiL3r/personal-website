# Design and Architecture

## Purpose

This document explains how the portfolio is structured and why it is organized this way.

The project is not trying to be a full CMS or a generic template. It is a code-first portfolio with a small number of live integrations, optimized for:

- clarity of professional signal
- maintainable frontend composition
- predictable external data flow
- low operational complexity

## Product Goals

### Primary goals

- Present engineering experience with a professional, high-quality visual language
- Keep the main user journey inside a single-page portfolio flow
- Add a few live elements without letting them dominate the site
- Support multiple languages with compile-time safety
- Keep the deployment model simple enough for a personal project

### Non-goals

- Headless CMS integration
- Authentication or personalized dashboards
- Complex analytics or persistent product-style backends
- Real-time infra beyond what is useful for portfolio storytelling

## Site Structure

The main experience lives on `/` and is section-based:

1. Hero
2. Experience
3. About / Profile
4. Education
5. Extracurriculars
6. Contact

The navbar scrolls to section anchors instead of routing to separate pages for core portfolio content. This keeps the experience coherent and avoids fragmenting the narrative.

Additional routes exist only where they add value:

- `/experience` for a standalone timeline page
- `/blog` as a placeholder route
- `/about` as a redirect to `/#about` for backward compatibility
- `/sitemap.xml` for search-engine discovery

## Application Architecture

### App Router

The project uses Next.js App Router so that:

- page composition stays simple
- metadata and sitemap generation are first-class
- server routes can proxy external APIs cleanly

### Frontend composition

The component structure is split by responsibility:

- `components/sections`: page-level composition
- `components/home`, `components/about`, `components/experience`: domain-specific UI
- `components/layout`: shell-level concerns such as navbar, footer, and theme
- `components/ui`: reusable primitives

This keeps feature code close together while avoiding an overly abstract design system.

### Content model

Portfolio content is stored in code:

- work history and education in `lib/data/experience.ts`
- technical categories in `lib/data/techStack.ts`
- locale strings in `lib/locales/*.ts`

This is intentional. For a portfolio, code-based content is easier to version, review, and refactor than a CMS.

## State Management

There are only a few shared state domains, each handled explicitly:

### Locale

`LocaleContext` provides typed access to translation dictionaries. The `Translations` type in `lib/locales/types.ts` is the source of truth, so missing keys fail at compile time.

### Trophies

`TrophyContext` manages lightweight achievement state:

- unlocked trophy IDs
- progress counts
- `localStorage` persistence
- full-profile completion detection

This system is intentionally isolated from the rest of the app so it does not complicate normal content rendering.

### Theme

Theme state is handled through `next-themes`, with a minimal toggle component and CSS-variable-driven color tokens.

## Styling Strategy

Styling is a combination of:

- global CSS tokens and interaction rules in `app/globals.css`
- module CSS where a component has a distinctive internal layout
- inline styles where a component benefits from proximity and low indirection

This is a pragmatic mix rather than a purist approach.

### Visual principles

- surfaces are intentionally restrained
- motion supports hierarchy, not decoration
- interactive elements get stronger hover feedback than informational ones
- non-clickable containers stay quiet

The current card system is role-based:

- `surface-static`: structural containers with no hover emphasis
- `surface-info`: informational blocks with subtle feedback
- stronger hover/lift reserved for actual actions and links

## Data Flow

The site uses a small number of server routes to normalize external data before it reaches the UI.

### `/api/chess-stats`

Aggregates:

- Lichess user ratings
- Chess.com ratings
- Lichess opening data from recent rated games

The route returns a stable shape so the client components do not need to know about multiple upstream APIs.

### `/api/gaming-stats`

Combines:

- Steam-owned game playtime for selected titles
- manual overrides for unsupported titles

This route exists because the UI only needs a curated portfolio-facing subset of gaming data, not the raw Steam payload.

### `/api/visitors`

Tracks unique visitor countries for the visitor widget.

Priority order:

1. platform geo headers
2. Cloudflare geo header
3. IP-based fallback
4. local development fallback

Persistence is file-based with in-memory fallback so the feature still works in restricted environments.

## SEO and Metadata

The site includes:

- route-level metadata
- sitemap generation
- robots handling for unfinished pages such as `/blog`

This keeps the site crawlable without exposing placeholder content as production-ready material.

## Deployment Model

The site is designed for Vercel deployment with minimal operational burden.

### Why this is sufficient

- dynamic data needs are small
- external requests are simple proxy/aggregation work
- the site does not require long-lived background jobs
- failures in live widgets degrade gracefully

## Tradeoffs

### Why no CMS

Because the portfolio changes infrequently and benefits from code review more than editorial tooling.

### Why keep some live widgets at all

Because live data makes the site feel current and engineered, but only when it stays subordinate to the professional narrative.

### Why keep docs lightweight

Because this is still a personal site. The code should remain understandable without a large maintenance burden.

## Future Improvements

- Replace the GitHub avatar with a dedicated professional headshot in `public/`
- Add real blog content or remove the route entirely
- Replace file-based visitor storage with KV if durable serverless persistence becomes important
- Add image and Open Graph asset generation
- Add more measurable impact numbers to experience content
