---
tags:
  - factory
  - research
  - personal-website
project: personal-website
date: 2026-05-02
source: factory-archivist
---

# Research: Astro Framework Selection

## Finding

Astro is the clear winner for a static, widget-based personal dashboard deployed to GitHub Pages.

## Key Evidence

| Criterion | Astro Advantage |
|-----------|----------------|
| Static output | Native, zero config for GitHub Pages |
| Zero JS by default | Islands architecture: only interactive widget JS ships |
| Widget isolation | Built-in via islands, each hydrates independently |
| Progressive hydration | `client:idle`, `client:visible`, `client:load` directives |
| Bundle size | Smallest of alternatives (83% less JS than Next.js in benchmarks) |
| Deploy | Official GitHub Action (`withastro/action@v6`) |
| Multi-framework | Can mix React, Svelte, Solid, Vue in same project |

## Alternatives Considered

- **SvelteKit**: Requires `adapter-static`, ships JS for client nav, no built-in progressive hydration
- **Next.js**: Ships React runtime, requires export config, largest bundle size

## Decision Rationale

The spec demands fast first paint, progressive hydration, widget isolation, and static hosting. Astro's islands architecture was designed for exactly this pattern: static HTML shell with independently-hydrating interactive islands.

## References

- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Astro GitHub Pages Deploy](https://docs.astro.build/en/guides/deploy/github/)
- [Astro vs SvelteKit 2026](https://www.pkgpulse.com/blog/astro-vs-sveltekit-2026)

## Links

- [[personal-website]]
