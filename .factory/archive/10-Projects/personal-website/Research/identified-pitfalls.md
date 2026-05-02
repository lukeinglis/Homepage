---
tags:
  - factory
  - research
  - personal-website
project: personal-website
date: 2026-05-02
source: factory-archivist
---

# Research: Identified Pitfalls

## Critical

1. **Theme flash on load**: If day detection runs after first paint, users see wrong theme. Mitigation: inline `<script>` in `<head>` sets `data-day` before any rendering.

2. **Widget error cascade**: One broken widget (e.g., weather API down) breaks the whole page. Mitigation: error boundaries per widget, graceful degradation UI.

3. **Accessibility across 7 themes**: Maintaining WCAG AA contrast across 7 color schemes is non-trivial. Mitigation: contrast checking in eval script, constrained palette system.

## Important

4. **Geolocation permission fatigue**: Browser geolocation prompts on every new tab open. Mitigation: cache coordinates in localStorage, only prompt once.

5. **localStorage quota**: Notes/scratchpad could fill ~5MB limit. Mitigation: warn at 80% capacity, trim oldest data.

## Low Risk

6. **Weather widget CORS**: Some weather APIs block browser requests. Avoided by using Open-Meteo (explicitly supports CORS).

7. **GitHub Pages SPA routing**: Pages doesn't support SPA routing. Not an issue for Astro static output (each page is a real HTML file).

8. **Timezone edge cases**: `new Date().getDay()` uses local timezone by default. No server-side timezone logic needed.

## Links

- [[personal-website]]
- [[widget-islands-architecture]]
- [[day-theme-architecture]]
