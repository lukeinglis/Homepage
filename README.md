# Personal Dashboard

A day-aware personal start page that changes its theme, greeting, and quick links based on the day of the week. Built with Astro and TypeScript.

## Features

- 7 distinct day themes with WCAG AA compliant color contrast
- 5 interactive widgets: clock, weather, quick links, quote, and notes
- Responsive layout (1/2/3 column grid)
- Error boundaries prevent widget failures from crashing the page
- Zero external JS by default (Astro islands architecture)
- Weather via Open-Meteo (no API key required)
- Notes persisted to localStorage

## Quick Start

```bash
git clone <repo-url>
cd personal-website
npm install
npm run dev
```

Open `http://localhost:4321` in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview built site |
| `npm test` | Run all unit tests |
| `npm run test:isolation` | Run widget isolation tests |
| `npm run lint` | Lint with ESLint |
| `npm run lighthouse` | Run Lighthouse performance audit |

## Adding a New Widget

1. Create a Preact component in `src/components/YourWidget.tsx`:

```tsx
export function YourWidget() {
  return <div class="widget">Content here</div>;
}
```

2. Import it in `src/pages/index.astro` and add it to the widget grid wrapped in a `WidgetWrapper`:

```astro
<WidgetWrapper name="yourWidget" client:idle>
  <YourWidget />
</WidgetWrapper>
```

3. Choose a hydration directive:
   - `client:load` for widgets that must be interactive immediately (clock, quick links)
   - `client:idle` for widgets that can wait for browser idle (weather, quote)
   - `client:visible` for below-the-fold widgets (notes)

4. Add the widget ID to each day config's `widgets` array in `src/config/days/*.ts`:

```ts
widgets: [
  { id: "clock" },
  { id: "yourWidget" },
  // ...
],
```

5. Add a test in `src/components/YourWidget.test.tsx`.

## Editing a Day's Config

Day configs live in `src/config/days/`. Each file (`monday.ts` through `sunday.ts`) exports a `DayConfig` object:

| Field | Type | Description |
|---|---|---|
| `name` | string | Day identifier (lowercase) |
| `theme.primary` | hex | Headings, emphasis elements |
| `theme.secondary` | hex | Subtext, muted labels (must pass 4.5:1 on white) |
| `theme.accent` | hex | Hover backgrounds, decorative borders |
| `theme.background` | hex | Page background |
| `theme.surface` | hex | Widget card background |
| `theme.text` | hex | Body text |
| `greeting.morning/afternoon/evening` | string | Time-of-day greeting message |
| `widgets` | WidgetSlot[] | Which widgets to show |
| `quickLinks` | QuickLink[] | Links with name, url, optional icon |
| `focusText` | string | Motivational text for the day |

After editing, run `npm test` to verify WCAG contrast ratios still pass.

## Deploying to GitHub Pages

1. Push to a GitHub repository
2. Go to Settings > Pages
3. Set source to "GitHub Actions"
4. The `.github/workflows/deploy.yml` workflow handles build and deploy automatically on push to `main`

## Architecture

```
src/
  config/
    types.ts          Type definitions (DayConfig, Theme, etc.)
    loader.ts         getDayConfig(), getGreeting(), getTimeOfDay()
    defaults.ts       Fallback config values
    days/             Per-day config files (monday.ts ... sunday.ts)
  components/
    WidgetWrapper.tsx  Error boundary for widget isolation
    ClockWidget.tsx    Real-time clock display
    WeatherWidget.tsx  Open-Meteo weather with geolocation
    QuickLinksWidget.tsx  Day-specific link grid
    QuoteWidget.tsx    Daily rotating quote
    NotesWidget.tsx    localStorage-backed scratchpad
  layouts/
    Layout.astro      HTML shell, CSS custom properties, theme switching
  pages/
    index.astro       Main page composing all widgets
  lib/
    weather.ts        Open-Meteo API client
    contrast.ts       WCAG contrast ratio utilities
  data/
    quotes.ts         Curated quote collection
```

**Theme switching:** An inline `<head>` script sets `data-day` on `<html>` before first paint. CSS custom properties (`--color-primary`, etc.) are overridden per day via `[data-day="monday"]` selectors. No theme flash.

**Widget isolation:** Each widget is an Astro island wrapped in `WidgetWrapper`, a Preact error boundary. If a widget throws, it shows "Widget unavailable" without affecting siblings.

**Hydration strategy:** Widgets use progressive hydration. `client:load` for above-the-fold interactive content, `client:idle` for deferred content, `client:visible` for below-fold content.
