---
tags:
  - factory
  - research
  - personal-website
  - architecture
topic: Current day config structure and widget system analysis
date: 2026-05-02
source: factory-archivist
---

# Current Day Config Structure

## Config Location
TypeScript configs at `src/config/days/*.ts`. Each implements `DayConfig` with a flat `quickLinks: QuickLink[]` array.

### QuickLink Interface (current)
Minimal: `{ name, url, icon? }`

### Widget System
The widget system is **hardcoded in `index.astro`**: widgets are manually imported and rendered in order, wrapped in `WidgetWrapper` error boundaries. The `WidgetSlot` array in DayConfig (`widgets: [{ id: "clock" }, ...]`) is defined but **not used for dynamic rendering**. All 7 days define the same 5 widgets.

## Recommended Type Change
Add `LinkSection` type to support categorized links:
```typescript
interface LinkSection {
  title: string;
  icon?: string;
  links: QuickLink[];
}
```

Add `linkSections?: LinkSection[]` to DayConfig alongside existing `quickLinks`. The `quickLinks` field stays as the "featured" top row, with `linkSections` providing categorized expansion below.

### Calendar Config (new)
```typescript
interface CalendarSource {
  name: string;       // "Work", "Personal"
  url: string;        // ICS/webcal URL
  color?: string;     // hex color for event dots
}

interface CalendarConfig {
  sources: CalendarSource[];
  refreshMinutes?: number; // default 15
}
```

Calendar sources are global (not per-day), so add to `src/config/calendar.ts` or `defaults.ts`.

### Caching Strategy for Calendar
- localStorage cache with configurable TTL (default 15 min)
- Stale-while-revalidate: render cached data immediately, fetch fresh in background
- Manual refresh button in widget UI

## Relevance
Foundation for both Issue #1 (LinkSection expansion) and Issue #2 (CalendarConfig type) in [[personal-website]].
