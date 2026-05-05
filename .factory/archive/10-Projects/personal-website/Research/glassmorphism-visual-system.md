---
name: Glassmorphism Visual System
description: Design system details from prototype: backdrop-filter blur, translucent cards, grain overlay, scene-scoped CSS
type: research
tags:
  - factory
  - research
  - personal-website
  - design-system
date: 2026-05-04
source: factory-archivist
---

# Glassmorphism Visual System

## Core Techniques

From the design prototype (`.factory/design-reference/src/`):

- **backdrop-filter: blur()** on card/module surfaces for frosted glass effect
- **Translucent backgrounds** using rgba with low alpha values
- **Grain texture overlay** for visual depth and organic feel
- **Scene-scoped CSS overrides**: each scene (weekday-am, weekday-pm, weekend-am, weekend-pm) defines its own color palette
- **Team-night overrides**: Auburn, Chelsea, Orioles each swap the entire palette (backgrounds + accent colors)

## CSS Architecture

The prototype uses:
- `.module` class for card containers
- `.chip` class for tag/badge elements
- `.kbd` class for keyboard shortcut indicators
- Scene-scoped selectors for palette switching
- `will-change: transform` on animated elements for GPU acceleration

## Implementation Notes for Astro + Preact

- Port all visual CSS to a global stylesheet (not component-scoped)
- Scene switching changes a top-level CSS class/data attribute
- Animated gradient orbs are 857 lines of CSS animations in the prototype
- Orbs need separate Preact components wrapping CSS-only animations

## Links

- [[scene-based-redesign-overview]]
- [[personal-website]]
