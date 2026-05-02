---
tags:
  - factory
  - research
  - personal-website
project: personal-website
date: 2026-05-02
source: factory-archivist
---

# Research: Similar Startpage Projects

## Directly Relevant Projects

| Project | Stars | Key Takeaway |
|---------|-------|-------------|
| [Bento](https://github.com/migueravila/Bento) | ~2.1k | Minimalist, hackable startpage. Config-driven via `config.js`. Three layouts. Good UX reference but no day-awareness. |
| [Catppuccin Startpage](https://github.com/pivoshenko/catppuccin-startpage) | ~1k+ | GitHub Pages native. Local fonts/icons for performance. Palette-driven theming. Closest aesthetic match. |
| Hiccup | - | Static startpage with PWA support, localStorage caching, built-in search. Good offline/localStorage patterns. |
| [Bento-next (Vue 3)](https://github.com/Kevin-2483/Bento-custom) | - | Vue 3 rewrite of Bento with GitHub Pages deploy. Proves SPA-on-Pages is viable. |

## Architecture Reference (Heavier-Weight)

| Project | Stars | Relevance |
|---------|-------|-----------|
| [Homepage](https://github.com/gethomepage/homepage) | ~20k | YAML-configured widget system. Widget registry pattern. Too server-oriented. |
| [Glance](https://github.com/glanceapp/glance) | ~25k | Go backend, YAML config. Feed aggregation widget patterns. |
| [Dashy](https://dashy.to/) | ~18k | 50+ widget types. Widget isolation patterns and theme system. |

## Cross-Project Patterns

1. **Config-driven**: All successful startpages use a single config file (JS/JSON/YAML)
2. **Widget isolation**: Widgets as self-contained components, never sharing DOM state
3. **Local-first**: localStorage for persistence, no backend required
4. **CSS variables for theming**: Every project uses CSS custom properties

## Links

- [[personal-website]]
- [[astro-framework-selection]]
