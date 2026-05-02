---
tags:
  - factory
  - experiment
  - personal-website
project: personal-website
experiment_id: 7
cycle: 3
cycle_experiment: 2
verdict: keep
score_delta: 0
date: 2026-05-02
source: factory-archivist
---

# Experiment #7 (Cycle 3, Exp 2): Fix weather blank state, style notes textarea, add per-day favicon

## Hypothesis
Three scoped CSS/UI fixes in one PR: weather skeleton visibility (#5), notes textarea styling (#6), per-day favicon (#12). All share the same surface (Layout.astro CSS) and are independent.

## Result
**KEEP** — score 1.000 before, 1.000 after (delta: +0.000). 3 issues fixed, PR #14 open for review.

## What Changed

### Weather skeleton (#5)
- Pulse keyframe animation on `.skeleton-line`, `.skeleton-temp`, `.skeleton-detail`
- Semi-transparent background with explicit dimensions so skeletons are visible on light day themes
- Subtle border on loading/error states for card distinguishability

### Notes textarea (#6)
- Themed border with `--color-accent`, 0.75rem border-radius matching widget cards
- Focus ring using `--color-primary` with outline-offset for keyboard accessibility
- Placeholder opacity styling, vertical resize, `font-family: inherit`

### Per-day favicon (#12)
- Inline `<script>` reads computed `--color-primary` CSS variable
- Generates SVG rounded square, sets as favicon via `data:image/svg+xml` URI
- Falls back to existing `/favicon.svg` if script fails

## Files Changed
1 file (src/layouts/Layout.astro), purely additive CSS + inline script.

## Notes
- No composite eval delta: bottlenecks are type_check (0.0, 108 TS7026 errors) and capability_surface (0.0), not visual polish.
- Skeleton backgrounds use hardcoded `rgba(30, 41, 59, 0.1)` instead of theme variable. Acceptable since all current themes are light.
- Closes 3 GitHub issues, improving user-facing quality for subsequent cycles.

## Links
- [[personal-website]]
- PR: #14
- Issues: #5, #6, #12
