---
tags:
  - factory
  - strategy
  - personal-website
date: 2026-05-02
source: factory-archivist
verdict: APPROVED
---

# Strategy: personal-website, 2026-05-02

## CEO Verdict

**PROCEED** — Plan covers all 7 spec backlog items across 6 well-scoped phases. Each phase is one PR's worth of work. Dependencies correctly ordered. Architectural decisions align with Researcher's recommendations. No issues found.

## Build Order

```
Phase 1 (H1) — scaffold, tooling, CI
     |
Phase 2 (H2) — day-config system + base layout + theme switching
     |
Phase 3 (H3) — clock + quick links widgets + widget wrapper
     |
Phase 4 (H4) — weather widget (Open-Meteo)
     |
Phase 5 (H5) — notes + quote widgets
     |
Phase 6 (H6) — complete configs, isolation tests, lighthouse, README
```

All phases sequential: each depends on prior phase output.

## Phase Details

### H1: Scaffold + Tooling + Eval Harness
- **Category:** FIX | **Growth:** factory_effectiveness
- Initialize Astro with TypeScript strict
- Vitest, ESLint (astro plugin), Prettier (astro plugin)
- GitHub Actions deploy workflow (`withastro/action@v6`)
- Stub `test:isolation` and `lighthouse` scripts
- Wire up `eval/score.js`
- **Expected:** build 0->1.0, lint 0->1.0

### H2: Day-Config System + Base Layout
- **Category:** EXPLOIT | **Growth:** capability_surface
- TypeScript interfaces: DayConfig, Theme, Greeting, QuickLink, WidgetSlot
- 7 day config files (monday.ts through sunday.ts) with distinct themes
- Config loader: `getDayConfig()`, `getDayName()`
- Layout.astro: `data-day` attribute, CSS custom properties, inline head script
- Index page: greeting, focus mode, widget grid placeholder
- Tests: config loader, day detection, greeting time-of-day logic
- **Expected:** day_configs 0->1.0

### H3: Clock + Quick Links Widgets
- **Category:** EXPLOIT | **Growth:** capability_surface
- Clock widget (client:load): time, date, day name
- Quick links widget (client:load): day-specific links grid
- WidgetWrapper: error boundary pattern (catch, fallback, log, never propagate)
- Widget grid CSS: 1col mobile, 2col tablet, 3col desktop
- Tests: clock formatting, quick links rendering, error boundary
- **Expected:** widget_isolation 0->1.0

### H4: Weather Widget
- **Category:** EXPLOIT | **Growth:** capability_surface
- Weather widget (client:idle): temperature, WMO condition, wind
- Geolocation: navigator.geolocation, cache lat/lon in localStorage
- Open-Meteo client: fetch, parse, WMO code mapping
- Loading skeleton, error fallback ("Weather unavailable")
- Tests: API parsing, WMO mapping, localStorage caching, error states

### H5: Notes + Quote Widgets
- **Category:** EXPLOIT | **Growth:** capability_surface
- Notes widget (client:visible): textarea, debounced localStorage, char count, quota warning
- Quote widget (client:idle): 50 static quotes, day-of-year rotation
- Tests: localStorage persistence, quote rotation, debounce

### H6: Polish
- **Category:** EXPLOIT | **Growth:** capability_surface
- WCAG AA contrast validation for all 7 themes
- Widget isolation integration test
- Lighthouse runner (performance >= 90)
- README: overview, dev setup, add widget guide, edit config guide, architecture
- Final eval: all 6 dimensions pass, composite >= 0.8

## Anti-Patterns to Avoid

- Theme flash from deferred `data-day` setting
- Geolocation prompt on every load (cache in localStorage)
- Widget coupling (no shared DOM state, no lifecycle dependencies)
- Heavy JS bundles (Astro ships zero JS by default)
- WCAG violations (check during development, not just at end)
- localStorage abuse (debounce writes, warn near quota)

## Links

- [[personal-website|Project Dashboard]]
