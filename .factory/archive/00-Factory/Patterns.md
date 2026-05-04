---
tags:
  - factory
  - patterns
source: factory-archivist
---

# Cross-Project Patterns

## Config-Driven Widget Systems
Discovered in [[personal-website]] research phase.
All successful startpage/dashboard projects use a single config file (JS/JSON/YAML) for customization. Widget isolation via self-contained components that never share DOM state directly. This pattern applies broadly to any component-based dashboard project.

## CSS Custom Properties for Theming
Discovered in [[personal-website]] research phase.
Every surveyed dashboard project uses CSS custom properties for theming. Combined with a data attribute on `<html>` and an inline `<head>` script, this prevents theme flash on load. Applicable to any project with dynamic theming needs.

## Zero-Revert Build Cycles via Phased Strategy
Discovered in [[personal-website]] full cycle (2026-05-02).
A 6-phase build plan with strict dependency ordering (scaffold, config system, then widgets in dependency order, then polish) achieved 6/6 keeps with zero reverts. Key factors: each phase was one PR's worth of scope, eval dimensions were additive (new dimensions only scored once their phase was reached), and the polish phase (WCAG, isolation tests, Lighthouse) was last. This pattern of "build in layers, validate at each layer, polish last" produced a clean monotonic score progression (0.85 to 1.0).

## Design Prototype as Research Input
Discovered in [[personal-website]] Issue #15 research (2026-05-04).
When user provides a design prototype (even in a different framework), extracting and analyzing the prototype files yields more actionable research than web searches. The prototype is the ground truth for scope, visual system, and data model. Web research for "glassmorphism dashboards" or "scene-based layouts" would return generic results, while the actual prototype defines exactly what ~30 modules, 4 scenes, 3 team overrides, and 857 lines of background animations look like. Pattern: prioritize analyzing user-provided artifacts over searching for similar external projects.
