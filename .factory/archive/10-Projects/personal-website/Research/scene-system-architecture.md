---
name: Scene System Architecture
description: 4-scene system replacing 7 day configs, with time-of-day and team-night override logic
type: research
tags:
  - factory
  - research
  - personal-website
  - architecture
date: 2026-05-04
source: factory-archivist
---

# Scene System Architecture

## Scene Model

Replaces the current 7 day-specific configs (`src/config/days/*.ts`) with 4 scenes:

| Scene | When | Character |
|-------|------|-----------|
| weekday-am | Mon-Fri, morning | Work-focused, professional modules |
| weekday-pm | Mon-Fri, afternoon/evening | Relaxation, sports, cooking |
| weekend-am | Sat-Sun, morning | Leisurely, life admin |
| weekend-pm | Sat-Sun, afternoon/evening | Entertainment, social |

## Team-Night Overrides

3 team-night modes that override any scene:
- **Auburn**: Auburn Tigers game day colors + sports-heavy modules
- **Chelsea**: Chelsea FC colors + football-focused modules
- **Orioles**: Baltimore Orioles colors + baseball-focused modules

Each override swaps: background gradient orbs, accent colors, and optionally promotes relevant modules.

## Current vs. New Architecture

| Aspect | Current (day-based) | New (scene-based) |
|--------|---------------------|-------------------|
| Config units | 7 day files | 4 scene configs + 3 team overrides |
| Switching logic | Day of week | Day of week + time of day |
| Modules per view | 6 widgets (same for all days) | ~30 modules, scene-specific subsets |
| Visual theming | Per-day color themes | Per-scene glassmorphism palettes |
| Data model | DayConfig with quickLinks | Scene with categorized module sets |

## Migration Considerations

- The existing `DayConfig` type and day-specific configs become obsolete
- Widget system (Clock, Weather, QuickLinks, Calendar, Quote, Notes) gets absorbed into the module system
- The `WidgetSlot` concept is replaced by scene-specific module layouts
- Calendar widget and ICS proxy (from Issues #1, #2) remain relevant as modules within scenes

## Links

- [[scene-based-redesign-overview]]
- [[glassmorphism-visual-system]]
- [[personal-website]]
