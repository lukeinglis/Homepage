---
tags:
  - factory
  - experiment
  - personal-website
project: personal-website
experiment_id: 5
verdict: keep
date: 2026-05-02
source: factory-archivist
---

# Experiment #5: H5 Notes + Quote Widgets

## Hypothesis
Add notes/scratchpad widget with localStorage persistence and quote widget with 50 static quotes rotating by day-of-year.

## Result
**KEEP** — Builder timed out during implementation, CEO intervened to fix 2 test issues and committed directly. 115 tests passing.

## What Changed
- Notes widget: textarea with localStorage persistence, debounced saves
- Quote widget: 50 embedded quotes, daily rotation via day-of-year modulo
- Builder timeout required CEO manual fix for 2 failing tests
- Commit: aa79240 "Add notes/scratchpad and quote widgets"

## Notes
- Builder timeout is a recurring pattern; complex widget additions with many tests push close to time limits
- CEO direct fix kept velocity; 2 test issues were minor

## Links
- [[personal-website]]
