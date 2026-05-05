---
name: Prototype Module Inventory
description: Complete inventory of ~30 modules across 5 categories from the design prototype
type: research
tags:
  - factory
  - research
  - personal-website
  - modules
date: 2026-05-04
source: factory-archivist
---

# Prototype Module Inventory

## Categories and Source Files

### Work (~340 lines in modules-work.jsx)
Professional and productivity modules: email, calendar integration, project links, professional tools.

### Sports (~490 lines in modules-sports.jsx)
Sports news, scores, betting, fantasy sports. Largest category by code volume. Includes team-specific modules for Auburn, Chelsea, Orioles.

### Cooking (~240 lines in modules-cooking.jsx)
Recipe links, meal planning, cooking reference modules.

### Life (~410 lines in modules-life.jsx)
Personal admin, finance, health, lifestyle modules.

### Navigation/Extra (~385 lines in modules-extra.jsx)
Cross-cutting modules: scene switcher, settings, utilities, navigation aids.

## Data Layer (data.jsx, ~570 lines)

All module content data: bookmark URLs, labels, icons, categories. Currently uses `window.*` globals in the prototype. Production version needs typed TypeScript module exports.

## Module Count

~30 modules total across the 5 categories, compared to the current site's 6 hardcoded widgets (Clock, Weather, QuickLinks, Calendar, Quote, Notes).

## Existing Widgets to Absorb

The current widgets from Issues #1/#2/#4 (Clock, Weather, QuickLinks with sections, Calendar with ICS) get absorbed as modules within the scene system. Their functionality persists but their visual presentation changes to match the glassmorphism design.

## Links

- [[scene-based-redesign-overview]]
- [[scene-system-architecture]]
- [[personal-website]]
