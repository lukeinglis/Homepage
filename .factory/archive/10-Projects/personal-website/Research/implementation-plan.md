---
tags:
  - factory
  - research
  - personal-website
  - planning
topic: Implementation order and complexity assessment for Issues 1 and 2
date: 2026-05-02
source: factory-archivist
---

# Implementation Order and Complexity

## Recommended Order
1. **Issue #1 first** (Port personalized links): No external dependencies, no proxy needed, immediate user value.
2. **Issue #2 second** (Calendar widget MVP): Depends on having the link sections in place if content-aware adaptation is desired later.

## Complexity Assessment

### Issue #1: Port Personalized Links
**Low complexity.** Type change + config population + widget UI update.
- ~3 files changed (types, widget, maybe defaults)
- ~7 files with new link data (day configs)
- No new dependencies

### Issue #2 MVP: Calendar Widget
**Medium complexity.** New dependency, serverless function, widget component, config type, caching.
- New npm dependency: ical.js
- New serverless function: `api/calendar-proxy.ts`
- New widget component: CalendarWidget
- New config type: CalendarConfig
- localStorage caching logic
- ~6-8 new/changed files

### Issue #2 Stretch: Content-Aware Adaptation
**High complexity.** Rule engine, calendar-to-link integration, dynamic layout. Defer to separate cycle.

## Backlog Cleanup
- "Enable GitHub Pages" : **Obsolete** (site is on Vercel)
- "Default weather location" : **Done** (defaults.ts has London fallback)
- "Personalize quick links" : **Issue #1**
- "Port links" + "calendar widget" : **Issues #1 and #2**

## CEO Verdict
**PROCEED.** Research covers all areas comprehensively. Recommendation to split Issue #2 into MVP vs stretch is sound.

## Relevance
Guides the Strategist in forming the hypothesis for [[personal-website]] Cycle 2.
