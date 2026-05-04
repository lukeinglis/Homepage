---
name: Scene-Based Dashboard Redesign Overview
description: Issue #15 redesign from day-based themes to scene-based glassmorphism dashboard with 4 scenes, ~30 modules, animated backgrounds
type: research
tags:
  - factory
  - research
  - personal-website
  - redesign
date: 2026-05-04
source: factory-archivist
---

# Scene-Based Dashboard Redesign (Issue #15)

## Summary

Major visual and architectural overhaul: replace the current 7 day-based configs with a 4 scene system (weekday AM, weekday PM, weekend AM, weekend PM) plus team-night overrides. Moves from simple widget grid to a glassmorphism dashboard with animated gradient backgrounds.

## Design Prototype

Source: user-provided zip, extracted to `.factory/design-reference/src/`
Size: ~3000 lines of React JSX across 11 files
Stack: CDN-loaded React 18 + Tailwind + Babel standalone (browser-compiled)

### File Breakdown

| File | Lines | Purpose |
|------|-------|---------|
| app.jsx | ~170 | Main app shell, scene orchestration |
| backgrounds.jsx | ~857 | Animated gradient orbs per scene/team |
| scenes.jsx | ~320 | Scene layout definitions, 4 scene configs |
| data.jsx | ~570 | All module data, links, bookmarks |
| cmdk.jsx | ~210 | Cmd+K fuzzy search palette |
| icons.jsx | ~195 | SVG icon components |
| modules-work.jsx | ~340 | Work category modules |
| modules-sports.jsx | ~490 | Sports category modules |
| modules-cooking.jsx | ~240 | Cooking category modules |
| modules-life.jsx | ~410 | Life category modules |
| modules-extra.jsx | ~385 | Navigation/extra modules |

## Key Design Elements

1. **4 Scenes**: weekday-am, weekday-pm, weekend-am, weekend-pm
2. **~30 Modules** across 5 categories: Work, Sports, Cooking, Life, Navigation
3. **3 Team-Night Overrides**: Auburn, Chelsea, Orioles (swap backgrounds + accent colors)
4. **Animated Backgrounds**: CSS gradient orb animations, scene-specific and team-specific
5. **Cmd+K Palette**: Fuzzy search across all categorized bookmarks
6. **Glassmorphism Visual System**: backdrop-filter blur, translucent cards, grain texture overlay
7. **Fonts**: Newsreader (Google Fonts), Geist + Geist Mono (Vercel CDN)

## Migration Path

Prototype uses React; production stack is Astro 6.2 + Preact 10.29 + TypeScript.

Key decisions:
- Scene orchestration as single Preact island (`client:load`)
- Port vanilla CSS (glassmorphism, scene scopes, animations) to global stylesheet
- Replace `window.*` globals with typed TypeScript module exports
- Background animations as separate Preact components with GPU-accelerated CSS
- Fonts loaded via `<link>` in Layout.astro

## Links

- [[personal-website]]
- GitHub Issue: #15
- Prototype: `.factory/design-reference/src/`
