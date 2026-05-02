---
tags:
  - factory
  - experiment
  - personal-website
project: personal-website
experiment_id: 1
verdict: keep
score_delta: "+0.85"
date: 2026-05-02
phase: H1
source: factory-archivist
---

# Experiment #1: H1 Scaffold + Tooling + Eval Harness

## Hypothesis
Astro project scaffold with TypeScript strict, Vitest, ESLint, Prettier, and GitHub Actions CI will establish a solid foundation scoring >= 0.8 on the eval harness.

## Result
**KEEP** — score: 0.85 (above 0.8 threshold)

## What Changed
- Astro project initialized with TypeScript strict mode
- Vitest configured for unit testing
- ESLint with eslint-plugin-astro and @typescript-eslint
- Prettier with prettier-plugin-astro
- GitHub Actions CI pipeline (build, test, lint)
- All npm scripts working: `build`, `test`, `lint`, `format`
- Eval harness wired up via `eval/score.cjs` (renamed from .js due to ESM/CJS conflict with `"type": "module"`)

## CEO Review
- **Verdict:** PROCEED
- **Note:** Builder renamed eval/score.js to eval/score.cjs. Acceptable given the project's ESM configuration.
- **Next:** Phase 2 (H2): Day-config system. TypeScript interfaces first, then 7 day configs, loader, Layout.astro.

## Links
- [[personal-website]]
