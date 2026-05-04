---
name: Cmd+K Search Palette Design
description: Fuzzy search palette from prototype covering all categorized bookmarks, ~210 lines of JSX
type: research
tags:
  - factory
  - research
  - personal-website
  - feature
date: 2026-05-04
source: factory-archivist
---

# Cmd+K Search Palette

## Overview

The design prototype includes a Cmd+K command palette (`cmdk.jsx`, ~210 lines) providing fuzzy search across all categorized bookmarks and modules.

## Functionality

- Keyboard shortcut: Cmd+K (Mac) to toggle
- Fuzzy search across all bookmark entries from `data.jsx`
- Results grouped by category (Work, Sports, Cooking, Life, Navigation)
- Keyboard navigation with arrow keys + Enter to open
- Visual styling consistent with glassmorphism theme (translucent backdrop, blur)

## Implementation for Preact

- Port as a Preact component within the main scene island
- Use a lightweight fuzzy search library or simple string matching
- Data source: the same typed module/bookmark data used by scene modules
- Accessibility: proper ARIA roles, focus management, escape to close

## Links

- [[scene-based-redesign-overview]]
- [[personal-website]]
