---
tags:
  - factory
  - research
  - personal-website
project: personal-website
date: 2026-05-02
source: factory-archivist
---

# Research: Widget Islands Architecture

## Pattern

Each widget is an isolated Astro island with its own hydration strategy.

## Hydration Strategy Per Widget

| Widget | Directive | Rationale |
|--------|-----------|-----------|
| Clock | `client:load` | Must be interactive immediately, updates every second |
| Weather | `client:idle` | Can wait for browser idle, fetches API data |
| Quick Links | `client:load` | Above the fold, primary interaction target |
| Quote | `client:idle` | Decorative, not urgent |
| Notes/Scratchpad | `client:visible` | Likely below fold, localStorage I/O |

## Error Isolation

Astro does not have built-in error boundaries for islands. Recommended approach:

1. Each widget wrapped in try/catch at the component level
2. A `<WidgetErrorFallback>` component shown when a widget fails
3. Widget failures logged to console but never propagate to parent
4. If using React islands: React error boundaries. If Svelte: `{#await}` / `onError` patterns.

## Key Benefit

Widget isolation means one broken widget (e.g., weather API down) never breaks the whole page. Each island hydrates independently.

## Pitfalls

- **localStorage quota**: Notes widget could fill 5MB limit. Mitigate with 80% capacity warning.
- **Geolocation permission fatigue**: Cache coordinates in localStorage, prompt once only.
- **Widget error cascade**: Error boundaries per widget are essential.

## Links

- [[personal-website]]
- [[day-theme-architecture]]
- [Astro Islands State Sharing](https://frontendatscale.com/blog/islands-architecture-state/)
