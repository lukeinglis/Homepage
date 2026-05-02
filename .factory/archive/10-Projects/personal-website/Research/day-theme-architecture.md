---
tags:
  - factory
  - research
  - personal-website
project: personal-website
date: 2026-05-02
source: factory-archivist
---

# Research: Day-Aware Theme Architecture

## Approach

CSS custom properties driven by a `data-day` attribute on `<html>`, set by an inline `<head>` script before any rendering.

## Theme Detection (Critical UX Detail)

Inline script in `<head>` sets the day attribute before first paint:

```javascript
const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
document.documentElement.setAttribute('data-day', days[new Date().getDay()]);
```

This prevents theme flash, which is the #1 UX pitfall identified in research.

## Day Config Structure

```typescript
interface DayConfig {
  theme: { primary, secondary, accent, background, surface, text, fontFamily? };
  greeting: { morning, afternoon, evening };
  widgets: Array<{ id: string; props?: Record<string, unknown> }>;
  quickLinks: Array<{ name, url, icon? }>;
  focusMode: string;
}
```

Seven config files (`monday.ts` through `sunday.ts`) plus `defaults.ts` fallback.

## CSS Implementation

```css
[data-day="monday"] { --color-primary: #4A90D9; --color-background: #F0F4F8; }
[data-day="friday"] { --color-primary: #E8A838; --color-background: #FFF8F0; }
```

## Accessibility Requirements

- All 7 themes must pass WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text)
- Use `oklch()` color space for perceptually uniform theme generation
- `prefers-reduced-motion` respected
- `prefers-color-scheme` could optionally override for dark mode

## Links

- [[personal-website]]
- [CSS Custom Properties Theming Guide](https://blog.logrocket.com/create-better-themes-with-css-variables/)
