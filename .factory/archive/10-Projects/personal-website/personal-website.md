---
tags:
  - factory
  - project
  - personal-website
source: factory-archivist
created: 2026-05-02
---

# Factory: personal-website

## Summary

A day-aware adaptive personal dashboard/start page. Theme, greeting, widgets, and quick links change based on the day of the week. Fully static (GitHub Pages), TypeScript, mobile-first.

## Status

- **State**: Cycle 2 research complete, strategy pending
- **Stack**: Astro 6 + Preact + TypeScript, deployed to Vercel
- **Current Score**: 1.0 (build complete, 6/6 phases kept)
- **Experiments Run**: 6
- **Kept**: 6, **Reverted**: 0
- **Next**: Issue #1 (personalized links) + Issue #2 MVP (calendar widget)

## Build Plan (Approved 2026-05-02)

| Phase | Hypothesis | Growth Dimension | Key Output |
|-------|-----------|-----------------|------------|
| 1 | H1: Scaffold + tooling + eval harness | factory_effectiveness | Astro init, Vitest, ESLint, Prettier, GH Actions, eval wiring |
| 2 | H2: Day-config system + base layout | capability_surface | TypeScript interfaces, 7 day configs, config loader, Layout.astro |
| 3 | H3: Clock + quick links widgets | capability_surface | Clock (client:load), QuickLinks (client:load), WidgetWrapper |
| 4 | H4: Weather widget | capability_surface | Open-Meteo integration, geolocation, WMO mapping |
| 5 | H5: Notes + quote widgets | capability_surface | Notes (localStorage), Quotes (50 static, day-of-year rotation) |
| 6 | H6: Polish | capability_surface | WCAG AA themes, isolation tests, Lighthouse, README |

Build order is strictly sequential: each phase depends on the prior.

## Eval Dimensions

| Dimension | Weight | Target |
|-----------|--------|--------|
| build | 0.20 | 1.0 |
| tests | 0.25 | 1.0 |
| lint | 0.15 | 1.0 |
| day_configs | 0.15 | 1.0 |
| widget_isolation | 0.15 | 1.0 |
| lighthouse | 0.10 | 1.0 |

**Threshold:** 0.8 composite

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Astro | Islands architecture for widget isolation, zero JS by default, native GitHub Pages deploy |
| Weather API | Open-Meteo | No API key, CORS-enabled, free for non-commercial |
| Theming | CSS custom properties + `data-day` attribute | Prevents theme flash via inline `<head>` script |
| Quotes | Static embedded list | External APIs too fragile for a start page that loads on every tab open |
| Hydration | Per-widget progressive | `client:load` for critical, `client:idle` for non-urgent, `client:visible` for below-fold |
| Error isolation | WidgetWrapper | Catch, fallback, log, never propagate. Spec guard. |

## Anti-Patterns to Avoid

- Theme flash from deferred `data-day` setting
- Geolocation prompt on every load (cache in localStorage)
- Widget coupling (no shared DOM state, no lifecycle dependencies)
- Heavy JS bundles (Astro ships zero JS by default)
- WCAG violations (check during development, not just at end)
- localStorage abuse (debounce writes, warn near quota)

## Deferred (Requires Human)

- ~~Enable GitHub Pages~~ : **Obsolete.** Deployed to Vercel.
- ~~Default weather location~~ : **Done.** London fallback in defaults.ts.
- Personalize quick links: **Issue #1** (Cycle 2)
- Provide real bank/finance URLs for link config

## Research Notes

- [[astro-framework-selection]]
- [[similar-startpage-projects]]
- [[open-meteo-weather-api]]
- [[day-theme-architecture]]
- [[widget-islands-architecture]]
- [[identified-pitfalls]]

## Strategy Snapshots

- [[personal-website-2026-05-02|Approved Build Plan (2026-05-02)]]
