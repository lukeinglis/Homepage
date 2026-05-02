---
tags:
  - factory
  - experiment
  - personal-website
project: personal-website
experiment_id: 3
verdict: keep
date: 2026-05-02
phase: H3
source: factory-archivist
---

# Experiment #3: H3 Clock + Quick Links Widgets

## Hypothesis
Add interactive Preact islands: clock widget (live updating), quick links widget (day-aware), and error boundary wrapper for widget isolation.

## Result
**KEEP** — 75 tests passing, all widgets rendering with client:load hydration.

## What Changed
- Clock widget: Preact island with live time display, updates every second, uses `client:load` hydration
- QuickLinks widget: Preact island rendering day-specific links from config, `client:load` hydration
- WidgetWrapper: error boundary component that catches widget errors and renders a fallback, preventing one broken widget from taking down the page
- Widget grid layout integrated into the base page layout
- 75 tests passing across all components

## Key Decisions
- Preact over React for smaller bundle size, same JSX API
- `client:load` hydration strategy (immediate) since both widgets need interactivity on page load
- Error boundary per widget, not per page: isolates failures to individual widgets

## Links
- [[personal-website]]
