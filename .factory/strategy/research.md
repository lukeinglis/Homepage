# Research: Personal Homepage, Day-Aware Adaptive Dashboard

## Project Summary

A browser start page that adapts its theme, greeting, widgets, and quick links based on the day of the week. Must be fully static (GitHub Pages), TypeScript, mobile-first, with isolated widgets and declarative per-day configuration. Five required widgets for v1: clock, weather, quick links, quotes, notes/scratchpad.

## Similar Projects

### Directly Relevant

| Project | Stars | Key Takeaway |
|---------|-------|-------------|
| [Bento](https://github.com/migueravila/Bento) | ~2.1k | Minimalist, hackable startpage. Config-driven via `config.js`. Three layouts (bento grid, lists, buttons). Good UX reference but no day-awareness. |
| [Catppuccin Startpage](https://github.com/pivoshenko/catppuccin-startpage) | ~1k+ | GitHub Pages native. Local fonts/icons for performance. Palette-driven theming. Closest aesthetic match to what we want. |
| [Hiccup](https://awesome-selfhosted.net/tags/personal-dashboards.html) | - | Static startpage with PWA support, localStorage caching, built-in search. Good reference for offline/localStorage patterns. |
| [Bento-next (Vue 3 fork)](https://github.com/Kevin-2483/Bento-custom) | - | Vue 3 rewrite of Bento with GitHub Pages deploy. Shows SPA-on-Pages is viable. |

### Heavier-Weight (Architecture Reference Only)

| Project | Stars | Relevance |
|---------|-------|-----------|
| [Homepage](https://github.com/gethomepage/homepage) | ~20k | YAML-configured widget system. Widget registry pattern worth studying, but too server-oriented for our needs. |
| [Glance](https://github.com/glanceapp/glance) | ~25k | Go backend, YAML config. Feed aggregation widget patterns are useful reference. |
| [Dashy](https://dashy.to/) | ~18k | 50+ widget types, Docker-based. Widget isolation patterns and theme system are instructive. |

### Key Patterns Observed Across Projects

1. **Config-driven**: All successful startpages use a single config file (JS/JSON/YAML) for customization.
2. **Widget isolation**: Widgets as self-contained components, never sharing DOM state directly.
3. **Local-first**: localStorage for persistence, no backend required.
4. **Theme via CSS variables**: Every project uses CSS custom properties for theming.

## Recommended Tech Stack

### Framework: Astro (strong recommendation)

Astro is the clear winner for this project. Here's why:

| Criterion | Astro | SvelteKit | Next.js |
|-----------|-------|-----------|---------|
| Static output (GitHub Pages) | Native, zero config | Requires adapter-static | Requires export config, ships extra JS |
| Zero JS by default | Yes (islands architecture) | No, ships JS for client nav | No, ships React runtime |
| Widget isolation | Built-in via islands, each hydrates independently | Manual, all components share one runtime | Manual, React context leaks between components |
| Progressive hydration | `client:idle`, `client:visible`, `client:load` directives | Not built-in | Not built-in |
| TypeScript | First-class support | First-class support | First-class support |
| Bundle size | Smallest (only interactive widget JS ships) | Small (Svelte compiles away) | Largest (React runtime + hydration) |
| GitHub Pages deploy | Official action (`withastro/action@v6`) | Manual workflow needed | Manual workflow needed |
| Multi-framework widgets | Yes (React, Svelte, Solid, Vue in same project) | Svelte only | React only |
| Lighthouse score potential | Highest (83% less JS than Next.js in benchmarks) | High | Moderate |

**Decision rationale**: The spec demands fast first paint, progressive hydration, widget isolation, and static hosting. Astro's islands architecture was literally designed for this exact pattern: static HTML shell with independently-hydrating interactive islands.

### TypeScript Configuration

- Astro has built-in TypeScript support, `strict` mode recommended
- Day configs can be typed with TypeScript interfaces for compile-time validation

### Build & Deploy

- **Build**: `astro build` outputs to `dist/` as pure static HTML/CSS/JS
- **Deploy**: GitHub Actions with `withastro/action@v6`, zero config
- **Dev**: `astro dev` with hot reload

### Styling

- **CSS custom properties** for day-theming (7 theme objects, applied via `data-day` attribute on `<html>`)
- **Scoped styles** via Astro's built-in scoped CSS (no CSS-in-JS library needed)
- No CSS framework required; utility classes optional

## Architecture Patterns

### Day-Config System

```
config/
  days/
    monday.ts    # { theme, greeting, widgets, quickLinks, focusMode }
    tuesday.ts
    ...
  widgets.ts     # widget registry: ID -> component mapping
  defaults.ts    # fallback values
```

Each day config is a typed TypeScript object:

```typescript
interface DayConfig {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    fontFamily?: string;
  };
  greeting: {
    morning: string;   // before 12:00
    afternoon: string; // 12:00-17:00
    evening: string;   // after 17:00
  };
  widgets: Array<{ id: string; props?: Record<string, unknown> }>;
  quickLinks: Array<{ name: string; url: string; icon?: string }>;
  focusMode: string;
}
```

### Widget Architecture (Astro Islands)

Each widget is an isolated Astro island:

```astro
<!-- In the page layout -->
<ClockWidget client:load theme={dayConfig.theme} />
<WeatherWidget client:idle location={config.location} />
<QuickLinks client:load links={dayConfig.quickLinks} />
<QuoteWidget client:idle />
<NotesWidget client:visible />
```

Hydration strategy per widget:
- **Clock**: `client:load` (must be interactive immediately, updates every second)
- **Weather**: `client:idle` (can wait for browser idle, fetches API data)
- **Quick Links**: `client:load` (above the fold, primary interaction target)
- **Quote**: `client:idle` (decorative, not urgent)
- **Notes/Scratchpad**: `client:visible` (likely below fold, localStorage I/O)

### Widget Isolation / Error Boundaries

Astro does not have built-in error boundaries for islands. Recommended approach:

1. Each widget wrapped in a try/catch at the component level
2. A `<WidgetErrorFallback>` component shown when a widget fails
3. Widget failures logged to console but never propagate to parent
4. Implementation: wrap each island in an error boundary component (if using React islands) or use Svelte's `{#await}` / `onError` patterns

### Theme Switching

The `data-day` attribute approach on `<html>`:

```css
[data-day="monday"] {
  --color-primary: #4A90D9;
  --color-background: #F0F4F8;
  /* ... */
}
[data-day="friday"] {
  --color-primary: #E8A838;
  --color-background: #FFF8F0;
  /* ... */
}
```

JavaScript on page load:
```javascript
const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
document.documentElement.setAttribute('data-day', days[new Date().getDay()]);
```

This runs before any framework hydration, so the correct theme is applied on first paint (no flash of wrong theme).

### Accessibility

- All 7 day themes must pass WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Use `oklch()` color space for perceptually uniform theme generation
- Keyboard navigation for all interactive elements
- `prefers-reduced-motion` respected for any animations
- `prefers-color-scheme` could optionally override day theme for dark mode users

## External APIs

### Weather: Open-Meteo (strong recommendation)

[Open-Meteo](https://open-meteo.com/) is the ideal choice:

- **No API key required**: Works from browser JavaScript immediately
- **Free for non-commercial use**: Perfect for a personal homepage
- **CORS-enabled**: Can be called directly from client-side JS
- **Geocoding API**: Separate endpoint for location lookup by name
- **WMO weather codes**: Standardized codes for weather conditions (mappable to icons)
- **High accuracy**: Sources data from national weather services globally

Example request:
```
https://api.open-meteo.com/v1/forecast?latitude=42.36&longitude=-71.06&current_weather=true
```

Response includes: temperature, wind speed, wind direction, weather code, and time.

**Geolocation strategy**:
1. Try browser `navigator.geolocation` API (requires user permission)
2. Fall back to config-defined default coordinates
3. Cache last-known coordinates in localStorage

### Quotes: Static Embedded List (recommended for v1)

For v1, embed a curated list of ~50-100 quotes directly in the source:

- **Why not an external API?** ZenQuotes, Quotable, and similar APIs have had reliability issues. For a start page that loads every time you open a browser tab, depending on an external API for decorative content is fragile.
- **Approach**: A `quotes.ts` file with an array of `{ text, author }` objects. Select based on day-of-year (`new Date().getDay()` for weekly rotation, or hash of date for daily).
- **Stretch**: Add [ZenQuotes.io](https://zenquotes.io/) (`/api/today` endpoint, no auth) as an optional external source with the static list as fallback.

### No-Auth API Summary

| API | Auth | CORS | Reliability | Use |
|-----|------|------|-------------|-----|
| [Open-Meteo](https://open-meteo.com/) | None | Yes | High | Weather (v1) |
| [ZenQuotes](https://zenquotes.io/) | None | Limited | Medium | Quotes (stretch) |
| Static embedded | N/A | N/A | Perfect | Quotes (v1) |

## Potential Pitfalls

1. **Theme flash on load**: If day detection runs after first paint, users see a flash of default theme. Mitigation: inline a `<script>` in `<head>` that sets `data-day` before any rendering.

2. **Weather widget CORS**: Some weather APIs block browser requests. Open-Meteo explicitly supports CORS, so this is avoided with the recommended API.

3. **Geolocation permission fatigue**: Browser geolocation prompts on every new tab open would be annoying. Mitigation: cache coordinates in localStorage, only prompt once.

4. **localStorage quota**: Notes/scratchpad could theoretically fill localStorage (~5MB limit). Mitigation: warn users at 80% capacity, trim oldest data.

5. **Widget error cascade**: One broken widget (e.g., weather API down) could break the whole page. Mitigation: error boundaries per widget, graceful degradation UI.

6. **Accessibility across 7 themes**: Maintaining WCAG AA contrast across 7 different color schemes is non-trivial. Mitigation: build contrast checking into the eval script; use a constrained palette system.

7. **GitHub Pages SPA routing**: GitHub Pages doesn't support SPA routing natively. Not an issue for Astro static output (each page is a real HTML file), but worth noting if adding client-side navigation later.

8. **Timezone edge cases**: Day-of-week detection should use the user's local timezone (which `new Date().getDay()` does by default). No server-side timezone logic needed.

## MVP Scope (First Cycle)

Aligned with the spec's backlog:

1. **Scaffold**: Astro project, TypeScript strict, GitHub Actions deploy to Pages
2. **Day system**: Config loader, 7 day configs with themes, layout that swaps by day
3. **Core widgets**: Clock, weather (Open-Meteo), quick links
4. **All 7 day configs**: Distinct themes, greetings, quick links (sensible defaults)
5. **Notes widget**: Scratchpad with localStorage persistence
6. **Quote widget**: Static rotating list, day-based selection
7. **README**: Document widget creation and day config editing

## References

- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Astro GitHub Pages Deploy](https://docs.astro.build/en/guides/deploy/github/)
- [Open-Meteo Weather API](https://open-meteo.com/)
- [Bento Startpage](https://github.com/migueravila/Bento)
- [Catppuccin Startpage](https://github.com/pivoshenko/catppuccin-startpage)
- [CSS Custom Properties Theming Guide](https://blog.logrocket.com/create-better-themes-with-css-variables/)
- [Astro Islands State Sharing](https://frontendatscale.com/blog/islands-architecture-state/)
- [Homepage Widget Tutorial](https://gethomepage.dev/widgets/authoring/tutorial/)
- [Astro vs SvelteKit 2026](https://www.pkgpulse.com/blog/astro-vs-sveltekit-2026)
