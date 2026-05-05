---
tags:
  - factory
  - strategy
  - personal-website
date: 2026-05-02
cycle: 3
source: factory-archivist
---

# Strategy: personal-website — 2026-05-02, Cycle 3

## Approved Hypothesis

**H1: Fix weather blank state, style notes textarea, add per-day favicon**
- Category: FIX
- Issues: #5, #6, #12
- CEO Verdict: PROCEED

## What Gets Built

1. **#5 Weather blank state (FIX):** Add skeleton animation CSS for `.skeleton-line`, `.skeleton-temp`, `.skeleton-detail` with theme-aware semi-transparent backgrounds and pulse keyframe. Fix `.weather-error` text color for WCAG AA contrast on light day backgrounds.

2. **#6 Notes textarea styling (FIX):** Add `.notes-textarea` CSS with theme-colored border, border-radius matching widget cards, font-family inherit, focus state with outline for keyboard accessibility.

3. **#12 Per-day favicon (EXPLORE):** Inline script in Layout.astro reads `data-day` attribute, generates SVG data URI using `--color-primary`, sets as favicon. Falls back to existing `/favicon.svg`.

## Rationale

- All three issues share Layout.astro as primary surface
- Pure CSS/JS changes, no new dependencies, no architectural changes
- Smallest, most independent issues from CEO FEEC analysis
- No expected composite eval score change (bottlenecks are type_check 0.0 and capability_surface 0.0), but closes 3 of 10 open GitHub issues

## Context

- Composite score at strategy time: 0.47
- Prior experiment: #1 (links + calendar widget), kept
- 10 open GitHub issues, 7 deferred as too large or needing user input
- Anti-patterns noted: don't fix type_check errors in same PR, don't attempt dark mode/PWA/search alongside these fixes
