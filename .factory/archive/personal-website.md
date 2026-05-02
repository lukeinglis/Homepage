---
tags:
  - factory
  - project
  - personal-website
source: factory-archivist
created: 2026-05-02
---

# Factory: personal-website

## Overview

Day-aware adaptive personal homepage/dashboard. Renders a different theme, greeting, quick links, and widget configuration for each day of the week. Designed as a browser start page.

## Stack

- **Framework:** Astro + TypeScript (strict)
- **Deployment:** GitHub Pages via GitHub Actions (`withastro/action@v6`)
- **Styling:** CSS custom properties, `data-day` attribute theming, mobile-first responsive
- **APIs:** Open-Meteo (weather, no API key, CORS-enabled)
- **Storage:** localStorage (notes persistence, geolocation cache)
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint (eslint-plugin-astro, @typescript-eslint) + Prettier (prettier-plugin-astro)

## Status

- **State:** Cycle 3, experiment 2 complete (KEEP)
- **Current Score:** 0.47 / 0.45 threshold
- **Experiments Run:** 8 (6 prior cycles + 2 this cycle)
- **Kept:** 8, **Reverted:** 0
- **Open Issues:** 7 (3 closed by PR #14: #5, #6, #12)
- **Current Cycle:** Fix open issues, in order that makes sense
- **Cycle 3 Results:** H1 kept (links+calendar), H2 kept (weather/notes/favicon polish)

## Recent Experiments
- [[personal-website-007]] — Cycle 3 Exp 2: Weather skeleton, notes textarea, per-day favicon (KEEP, +0.00)
- [[personal-website-006]] — H6 Final polish: WCAG AA, widget isolation, Lighthouse, README (KEEP, +0.15)
- [[personal-website-005]] — H5 Notes + Quote widgets, localStorage persistence (KEEP)
- [[personal-website-004]] — H4 Weather widget, Open-Meteo integration (KEEP)
- [[personal-website-003]] — H3 Clock + Quick Links widgets, error boundary (KEEP)
- [[personal-website-002]] — H2 Day-config system + base layout (KEEP)
- [[personal-website-001]] — H1 Scaffold + Tooling + Eval Harness (KEEP, +0.85)

## Build Plan (6 Phases, All Complete)

1. **H1: Scaffold + tooling + eval harness** (factory_effectiveness) — Astro init, Vitest, ESLint, Prettier, GitHub Actions, eval wiring
2. **H2: Day-config system + base layout** (capability_surface) — TypeScript interfaces, 7 day configs, config loader, Layout.astro with inline head script, theme CSS
3. **H3: Clock + quick links widgets** (capability_surface) — Clock widget (client:load), QuickLinks widget (client:load), WidgetWrapper error boundary, widget grid layout
4. **H4: Weather widget** (capability_surface) — Open-Meteo integration, geolocation with localStorage cache, WMO code mapping, loading/error states
5. **H5: Notes + quote widgets** (capability_surface) — Notes scratchpad (localStorage, debounced), Quote widget (static 50-quote rotation by day-of-year)
6. **H6: Polish** (capability_surface) — WCAG AA theme validation, widget isolation tests, Lighthouse, README

## Eval Dimensions (current)

| Dimension | Weight | Score |
|-----------|--------|-------|
| tests | 0.15 | 1.0 |
| lint | 0.075 | 0.9 |
| type_check | 0.05 | 0.0 |
| coverage | 0.125 | 0.5 |
| guard_patterns | 0.05 | 1.0 |
| config_parser | 0.05 | 1.0 |
| capability_surface | 0.14 | 0.0 |
| experiment_diversity | 0.11 | 0.5 |
| observability | 0.10 | 0.0 |
| research_grounding | 0.08 | 0.0 |
| factory_effectiveness | 0.07 | 0.5 |

**Composite:** 0.47 (threshold: 0.45)

## Key Architectural Decisions

- Astro islands: each widget is an independent island with its own hydration strategy
- CSS custom properties for theming via `[data-day]` selectors, no CSS-in-JS
- Inline `<head>` script for day detection before first paint (flash prevention)
- Error boundaries per widget via WidgetWrapper (catch, fallback, never propagate)
- localStorage for notes content and geolocation coordinates
- Static embedded quotes (50), rotated by day-of-year
- Open-Meteo: free, no key, CORS-enabled; geolocation cached in localStorage

## Deferred (Requires Human)

- Enable GitHub Pages in repository Settings > Pages > Source > GitHub Actions
- Update default weather location coordinates in `src/config/defaults.ts`
- Personalize quick links in `src/config/days/*.ts`

## Links

- [[personal-website-2026-05-02|Strategy Snapshot (2026-05-02)]]
- [[personal-website-2026-05-02-cycle3-strategy|Cycle 3 Strategy (2026-05-02)]]
