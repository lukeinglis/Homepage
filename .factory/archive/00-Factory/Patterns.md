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
