# Factory Configuration

## Goal

A personal browser homepage that adapts its theme, greeting, widgets, and quick links based on the day of the week. Fully static, deployable to GitHub Pages, built with Astro and TypeScript.

## Scope

### Modifiable

- src/**
- public/**
- config/**
- tests/**
- api/**
- package.json
- tsconfig.json
- astro.config.mjs
- middleware.ts
- README.md
- .github/**

### Read-only

- eval/score.cjs
- .factory/**
- LICENSE

## Guards

- Do not delete or overwrite existing tests
- Do not modify files outside the declared scope
- Do not introduce secrets or credentials into the repository
- Do not add server-side dependencies: the site must be deployable as fully static
- Each widget must be isolated: failure in one widget must not break the page
- Maintain WCAG AA color contrast across all day themes

## Eval

### Command

```bash
node eval/score.cjs
```

### Threshold

0.45

## Smoke Test

```bash
npm run build && grep -q 'data-day' dist/index.html
```

## Target Branch

main
