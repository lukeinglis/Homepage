## Strategy: Build Plan, 2026-05-02

### Observations
- **Project state:** Greenfield. Only `eval/score.js` and `.factory/` scaffolding exist.
- **Stack decision (confirmed by research + CEO):** Astro + TypeScript strict + GitHub Pages
- **Theming approach:** CSS custom properties via `data-day` attribute, inline `<head>` script to prevent theme flash
- **External APIs:** Open-Meteo (no key, CORS-enabled), static embedded quotes
- **Eval harness:** 6 dimensions (build 0.20, tests 0.25, lint 0.15, day_configs 0.15, widget_isolation 0.15, lighthouse 0.10), threshold 0.8
- **Key architectural patterns from research:** Islands architecture for widget isolation, progressive hydration per widget, localStorage for persistence, error boundaries per widget

### Hypotheses

#### H1: Project scaffold, tooling, and eval harness
- **Category:** FIX
- **Type:** code
- **Backlog item:** Scaffold the project with the chosen framework and set up CI build to GitHub Pages
- **Growth dimension:** factory_effectiveness
- **What:** Initialize Astro project with TypeScript strict. Set up the full dev toolchain:
  - `astro` with TypeScript strict mode (`tsconfig.json` extends `astro/tsconfigs/strict`)
  - `vitest` for unit/integration testing with `@testing-library` utilities
  - `eslint` with `eslint-plugin-astro` and `@typescript-eslint`
  - `prettier` with `prettier-plugin-astro`
  - npm scripts: `build`, `dev`, `test`, `test:isolation`, `lint`, `lint:fix`, `lighthouse`
  - GitHub Actions workflow (`.github/workflows/deploy.yml`) using `withastro/action@v6` for Pages deploy
  - Stub `test:isolation` and `lighthouse` scripts that pass initially (real implementations come in later phases)
  - Verify `eval/score.js` runs and reports all dimensions (most will fail until features land, that's expected)
- **Why:** Nothing else can be built until the scaffold exists. Eval must be runnable from phase 1.
- **Expected impact:** build 0.0->1.0, lint 0.0->1.0 (2 of 6 eval dimensions green)
- **Priority:** high

#### H2: Day-config system and base layout with theme switching
- **Category:** EXPLOIT
- **Type:** code
- **Backlog item:** Implement the day-config loader and a base layout that swaps theme and greeting by day. Define all 7 day configs with distinct themes (initial pass).
- **Growth dimension:** capability_surface
- **What:** Build the day-config system and the base layout that consumes it:
  - **TypeScript interfaces** (`src/config/types.ts`): `DayConfig`, `Theme`, `Greeting`, `QuickLink`, `WidgetSlot`
  - **Day config files** (`src/config/days/monday.ts` through `sunday.ts`): Each exports a `DayConfig` with theme colors, time-of-day greetings, widget list, quick links, and focus mode text. Initial themes: Monday=focused blue, Tuesday=productive green, Wednesday=balanced teal, Thursday=energetic purple, Friday=warm amber, Saturday=relaxed coral, Sunday=calm lavender.
  - **Config loader** (`src/config/loader.ts`): `getDayConfig()` returns today's config, `getDayName()` utility
  - **Defaults** (`src/config/defaults.ts`): Fallback config for any missing fields
  - **Base layout** (`src/layouts/Layout.astro`): HTML shell with `data-day` attribute, CSS custom properties for all 7 themes, responsive meta tags, inline `<head>` script that sets `data-day` before paint
  - **Index page** (`src/pages/index.astro`): Uses Layout, renders greeting (time-of-day aware), focus mode, widget grid placeholder
  - **CSS**: Custom properties for each day theme, applied via `[data-day="monday"]` selectors, mobile-first responsive grid
  - **Tests**: Unit tests for config loader, day detection, greeting time-of-day logic
- **Why:** The day-config system is the architectural foundation. Layout + configs are tightly coupled: you can't test one without the other. Research recommends inline head script for flash prevention.
- **Expected impact:** day_configs 0.0->1.0, tests partial improvement
- **Priority:** high

#### H3: Clock widget and quick links widget
- **Category:** EXPLOIT
- **Type:** code
- **Backlog item:** Implement the clock, weather, and quick-links widgets (clock + quick links portion)
- **Growth dimension:** capability_surface
- **What:** Build the first two interactive widgets as Astro islands:
  - **Clock widget** (`src/components/ClockWidget.astro` or `.tsx`): Displays current time (updating every second), date, and day name. Styled with day theme colors. Uses `client:load` hydration directive (must be interactive immediately).
  - **Quick links widget** (`src/components/QuickLinksWidget.astro` or `.tsx`): Renders the day's quick links as a responsive grid of clickable cards/tiles. Icons optional (emoji or simple SVG). Uses `client:load` (primary interaction target).
  - **Widget wrapper** (`src/components/WidgetWrapper.astro`): Error boundary pattern: wraps each island in try/catch, shows fallback on failure, logs error to console but never propagates.
  - **Widget grid** in index page: CSS grid layout for widgets, responsive (1 col mobile, 2 col tablet, 3 col desktop)
  - **Tests**: Clock formatting, quick links rendering, error boundary behavior
- **Why:** Clock and quick links are `client:load` widgets (above the fold, immediate interaction). Building the widget wrapper establishes the isolation pattern for all subsequent widgets.
- **Expected impact:** widget_isolation 0.0->1.0 (once test:isolation test is real), tests improvement
- **Priority:** high

#### H4: Weather widget with Open-Meteo integration
- **Category:** EXPLOIT
- **Type:** code
- **Backlog item:** Implement the clock, weather, and quick-links widgets (weather portion)
- **Growth dimension:** capability_surface
- **What:** Build the weather widget as an Astro island:
  - **Weather widget** (`src/components/WeatherWidget.astro` or `.tsx`): Shows current temperature, weather condition (mapped from WMO code to icon/text), wind speed. Uses `client:idle` hydration (can wait for browser idle).
  - **Geolocation logic**: Try `navigator.geolocation` on first visit, cache lat/lon in localStorage. Fallback to default coordinates (London: 51.51, -0.13, configurable in defaults.ts).
  - **Open-Meteo client** (`src/lib/weather.ts`): Fetch from `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true`. Parse response, map WMO weather codes to human-readable conditions and simple icons.
  - **Loading/error states**: Skeleton loader while fetching, graceful error fallback ("Weather unavailable") that doesn't crash the page.
  - **Tests**: Weather API response parsing, WMO code mapping, localStorage coordinate caching, error state rendering
- **Why:** Weather is the most complex widget (external API, geolocation, caching). Isolated to its own phase to keep PRs focused. Open-Meteo confirmed by research as the right choice (no API key, CORS-enabled).
- **Expected impact:** capability_surface +0.2, tests improvement
- **Priority:** high

#### H5: Notes/scratchpad and quote widgets
- **Category:** EXPLOIT
- **Type:** code
- **Backlog item:** Add the notes/scratchpad widget with localStorage. Add a quote widget with a static rotating list.
- **Growth dimension:** capability_surface
- **What:** Build the final two widgets:
  - **Notes widget** (`src/components/NotesWidget.astro` or `.tsx`): Textarea-based scratchpad. Persists content to localStorage on each keystroke (debounced ~500ms). Loads saved content on mount. Uses `client:visible` hydration (likely below fold). Shows character count, warns at 80% of localStorage quota.
  - **Quote widget** (`src/components/QuoteWidget.astro` or `.tsx`): Displays a quote from a static curated list (`src/data/quotes.ts`, ~50 quotes as `{ text, author }` objects). Selection based on day-of-year for daily rotation. Uses `client:idle` hydration. Styled with day theme accent color.
  - **Quotes data file** (`src/data/quotes.ts`): Curated list of 50 motivational/reflective quotes.
  - **Tests**: localStorage persistence (mock storage), quote rotation logic, debounce behavior
- **Why:** Both widgets are self-contained with no external dependencies. Notes uses localStorage, quotes use a static list. Grouping them keeps the PR focused on "local-first data" widgets.
- **Expected impact:** capability_surface +0.2, tests improvement
- **Priority:** high

#### H6: Complete day configs, widget isolation tests, and README
- **Category:** EXPLOIT
- **Type:** code
- **Backlog item:** All 7 day configs fully populated with distinct themes, quick links, and greetings. Write README documenting how to add a new widget and how to edit a day's config.
- **Growth dimension:** capability_surface
- **What:** Polish and complete the project:
  - **Day configs**: Review and fully populate all 7 day configs with:
    - Distinct WCAG AA-compliant color themes (verify contrast ratios)
    - Time-of-day greetings reflecting each day's personality (Monday=focused, Tuesday=productive, Wednesday=balance, Thursday=energetic, Friday=wind-down, Saturday=relaxed, Sunday=calm)
    - Curated quick links per day (work tools Mon-Fri, personal/leisure Sat-Sun)
    - Focus mode descriptions
    - Widget configuration (all 5 widgets enabled, potentially different props per day)
  - **Widget isolation test** (`test:isolation`): Integration test that simulates a broken widget (e.g., throws during render) and verifies the page still loads and other widgets still work.
  - **Lighthouse script**: Wire up `@lhci/cli` or a lightweight Lighthouse runner for the `lighthouse` npm script. Run against built output, assert performance >= 90.
  - **README.md**: Project overview, local development setup, how to add a new widget (step-by-step), how to edit a day's config, how to deploy, architecture overview.
  - **Final eval run**: All 6 dimensions should pass, composite score >= 0.8.
- **Why:** This is the polish phase. Day configs need WCAG AA validation per the spec guards. Widget isolation testing is 15% of the eval score. README is a spec requirement. Everything must pass eval before the project is considered complete.
- **Expected impact:** All eval dimensions -> 1.0, composite 1.0 (target: >= 0.8)
- **Priority:** high

### Build Order

```
Phase 1 (H1) ─── scaffold, tooling, CI
     │
Phase 2 (H2) ─── day-config system + base layout + theme switching
     │
Phase 3 (H3) ─── clock + quick links widgets + widget wrapper
     │
Phase 4 (H4) ─── weather widget (Open-Meteo)
     │
Phase 5 (H5) ─── notes + quote widgets
     │
Phase 6 (H6) ─── complete configs, isolation tests, lighthouse, README
```

All phases are sequential: each depends on the prior phase's output.

### Key Architectural Decisions

1. **Astro islands**: Each widget is an independent island with its own hydration strategy. No shared runtime between widgets.
2. **CSS custom properties for theming**: `[data-day="monday"] { --color-primary: ... }` applied at `<html>` level. No CSS-in-JS.
3. **Inline head script**: Day detection and `data-day` attribute set before first paint to prevent theme flash.
4. **Error boundaries per widget**: WidgetWrapper catches errors, shows fallback, never propagates. This is a spec guard.
5. **localStorage for state**: Notes content and geolocation coordinates cached in localStorage. No backend.
6. **Static quotes**: Embedded ~50 quotes in source code, rotated by day-of-year. No external API dependency for decorative content.
7. **Open-Meteo**: No API key, CORS-enabled, free. Geolocation with localStorage cache to avoid repeated permission prompts.

### Anti-patterns to Avoid
- **Theme flash**: Never set `data-day` in a deferred script. Must be inline in `<head>` before any rendering.
- **Geolocation on every load**: Cache coordinates in localStorage. Only prompt once.
- **Widget coupling**: Widgets must never share DOM state or depend on each other's lifecycle.
- **Heavy JS bundles**: Astro ships zero JS by default. Only interactive widgets add JS. Keep the bundle minimal.
- **WCAG violations**: All 7 themes must pass AA contrast. Check during development, not just at the end.
- **localStorage abuse**: Debounce writes, warn near quota limits, never store large blobs.

## Deferred

- **Enable GitHub Pages in repository settings**: Go to the repository's Settings > Pages > Source and select "GitHub Actions". The deploy workflow will be committed in Phase 1 but Pages must be manually enabled for deploys to work.
- **Default weather location**: The code uses browser geolocation with a fallback to London (51.51, -0.13). Update `src/config/defaults.ts` with your preferred default location coordinates.
- **Personalize quick links**: Phase 2 and 6 populate quick links with sensible defaults (common productivity tools, news sites, etc.). Edit each day's config file in `src/config/days/` to reflect your actual bookmarks.
