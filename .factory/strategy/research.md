# Research: Issue #15 Scene-Based Dashboard Redesign

## Design Prototype Analysis

The design prototype (`.factory/design-reference/src/`) is ~3000 lines of React JSX using CDN-loaded Tailwind, Babel standalone, and React 18. It defines:

- **4 scenes**: weekday AM, weekday PM, weekend AM, weekend PM
- **~30 modules** across 5 categories: Work, Sports, Cooking, Life, Navigation
- **3 team-night overrides**: Auburn, Chelsea, Orioles (swap backgrounds + accents)
- **Animated backgrounds**: 857 lines of gradient orb animations per scene/team
- **Cmd+K palette**: Fuzzy search across categorized bookmarks
- **Glassmorphism visual system**: backdrop-filter blur, translucent cards, grain overlay

## Current Project State

- **Stack**: Astro 6.2 + Preact 10.29 + TypeScript + Vitest
- **Current widgets**: Clock, Weather, QuickLinks, Calendar, Quote, Notes (6 total)
- **Current system**: 7 day-specific configs with per-day themes, simple widget grid
- **Deployment**: Vercel (static)
- **Tests**: 14 passing, vitest with happy-dom

## Migration Architecture

### Approach: Scene System on Astro + Preact

The prototype uses React but the production stack is Astro + Preact. Key decisions:

1. **Scene orchestration**: Build as a single Preact island (`client:load`) that manages scene state, transitions, and team-night mode. All modules render within this island.

2. **CSS strategy**: Port the prototype's vanilla CSS (glassmorphism, scene scopes, animations) into a global stylesheet. The `.module`, `.chip`, `.kbd`, scene-scoped overrides all live in CSS.

3. **Data layer**: Prototype uses `window.*` globals. Production uses TypeScript modules with typed data exports.

4. **Background animations**: Port as separate Preact components with CSS animations. Use `will-change: transform` for GPU acceleration.

5. **Fonts**: Newsreader (Google Fonts), Geist + Geist Mono (Vercel CDN). Load via `<link>` in Layout.astro.

### Scope: ~3000 lines prototype to Preact + TypeScript

Full implementation touches: 4 scene layouts, ~30 modules, animated backgrounds, Cmd+K palette, scene/team switchers, complete visual system overhaul.

## Prior Research (Issues #1 and #2)

Static Astro 6 site with Preact, deployed to Vercel. Personal dashboard with day-specific themes, greetings, widgets (clock, weather, quickLinks, quote, notes), and per-day quick links. Currently has only 4 generic quick links per day. Old site had 30+ categorized links across socials, sports, betting, fantasy, professional, and finance sections.

---

## Issue #1: Port Personalized Links

### Old Site Link Structure

The old site used JSON config files (`old-site-reference/config/`):
- `sites.json`: Master site catalog with 6 sections (socials, sports_news, sports_betting, fantasy_sports, professional, finances), ~30 links total
- `day-0.json` through `day-7.json`: Per-day overrides selecting subsets of links from the master catalog
- `day-template.json`: Empty template for unused days

Each link had: `name/label`, `url`, `type` (link or iframe), `icon` (Lucide name or emoji), `color`, `hover`, `extra` (Tailwind classes).

The old day configs used a **sections with target IDs** pattern:
```json
{
  "sections": [
    { "target": "quick", "title": "Quick Access", "links": [...] },
    { "target": "social", "title": "Social Media", "links": [...] }
  ]
}
```

Day 7 (Sunday/home) was the most populated: all 6 sections from sites.json. Weekday configs (day-1 through day-5) were sparser: typically just Quick Access + Social Media. Day 0 was an include directive pointing to another file.

### Current Site Structure

TypeScript configs at `src/config/days/*.ts`. Each implements `DayConfig` with a flat `quickLinks: QuickLink[]` array. The `QuickLink` interface is minimal: `{ name, url, icon? }`.

The widget system is **hardcoded in `index.astro`**: widgets are manually imported and rendered in order, wrapped in `WidgetWrapper` error boundaries. The `WidgetSlot` array in DayConfig (`widgets: [{ id: "clock" }, ...]`) is defined but **not used for dynamic rendering**. All 7 days define the same 5 widgets.

### Gap Analysis

| Feature | Old Site | Current Site |
|---------|----------|--------------|
| Links per day | 10-20+ across multiple sections | 4 flat links |
| Organization | Named sections (Socials, Sports, Finance) | Single array |
| Unique link count | ~30 | ~12 (duplicated across days) |
| Styling | Per-link Tailwind classes | None (theme-driven) |
| Embedded content | iframe support for KenPom, ETR, etc. | Not supported |

### Recommended Approach

**Option A (Minimal): Expand `quickLinks` array per day.** Keep the flat array but populate with all relevant links per day. Simple, no type changes needed.

**Option B (Sections): Add `linkSections` to DayConfig.** New interface:
```typescript
interface LinkSection {
  title: string;
  icon?: string;
  links: QuickLink[];
}
```
Add `linkSections?: LinkSection[]` to DayConfig alongside the existing `quickLinks`. The QuickLinksWidget renders sections with headers. `quickLinks` stays as the fallback/primary set.

**Recommendation: Option B.** The old site used sections for good reason: 30+ links without categories is unusable. This is a small type change with a proportional UI update to QuickLinksWidget. The `quickLinks` field can remain as the "featured" top row, with `linkSections` providing the categorized expansion below.

### Links to Port (from sites.json and issue #1)

**Socials** (4): Twitter/X, Instagram, Reddit, YouTube
**Sports News** (3): Auburn On3, Auburn Message Board, Chelsea FC
**Sports Betting** (5): DraftKings, Action Network, KenPom, ETR, Fantasy Labs
**Fantasy Sports** (5): ESPN Fantasy Baseball, Yahoo FF x3, Sleeper
**Professional** (3): Gmail, Yahoo Mail, LinkedIn
**Finances** (4): Bank placeholders (need real URLs from user)

Total: ~24 links to distribute across 7 day configs.

**Day mapping based on old site patterns and issue #1 guidance:**
- **Weekdays (Mon-Fri)**: Quick Access top row (Gmail, Calendar, LinkedIn, DraftKings). Socials section. Sports section compressed or hidden.
- **Weekends (Sat-Sun)**: Sports/betting/fantasy prominent. Socials always present. Professional secondary.
- **All days**: Socials always available.

---

## Issue #2: Calendar Widget with ICS Support

### ICS Parsing Library: ical.js

| Library | Browser | RFC 5545 | RRULE | Deps | Status |
|---------|---------|----------|-------|------|--------|
| **ical.js** (kewisch) | Native | Full | Full | Zero | v2.2.1, Mozilla-backed |
| node-ical | Node only | Full | Full | Many | Server-only |
| cal-parser | Yes | Partial | Limited | Few | Low maturity |
| tsdav | Yes | N/A | N/A | Some | CalDAV client, not parser |

**ical.js** (`npm install ical.js`) is the clear winner:
- Designed for the web, zero dependencies
- Parses RFC 5545 (iCalendar), RFC 7265 (jCal)
- Full RRULE, RDATE, EXDATE recurrence expansion via `RecurExpansion` class
- Browser import: `import ICAL from "ical.js"` or via unpkg CDN
- TypeScript types available
- Timezone support via optional `ical.timezones.js` addon (adds bundle size; skip if events have embedded VTIMEZONE data, which most do)
- Current version: v2.2.1

### CORS: The Core Problem

Calendar providers (iCloud, Google) do not send `Access-Control-Allow-Origin` headers on ICS feed responses. Browser `fetch()` calls from a different origin are blocked by CORS policy. This is by design: calendar feeds are intended for server-side consumption (Outlook, Apple Calendar apps), not browser JavaScript.

**There is no frontend-only workaround.** A server-side proxy is required.

### Proxy Options (ranked by fit)

**1. Vercel API Route / Serverless Function (Best fit)**

The site already deploys to Vercel. Two sub-options:

**1a. Standalone `api/` directory (recommended).** Create `api/calendar-proxy.ts` at the project root. Vercel auto-deploys files in `api/` as serverless functions, independent of Astro. Keeps Astro fully static (`output: 'static'`). No adapter change needed.

```typescript
// api/calendar-proxy.ts
export default async function handler(req, res) {
  const { url } = req.body;
  const response = await fetch(url.replace('webcal://', 'https://'));
  const text = await response.text();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/calendar');
  res.status(200).send(text);
}
```

**1b. Astro SSR with Vercel adapter.** Switch to `output: 'hybrid'`, add `@astrojs/vercel`. Astro pages can be server-rendered. More powerful but changes the deployment model.

**Recommendation: 1a.** Keep Astro static. The proxy is a single file, 15 lines of code.

**2. Cloudflare Worker (Good alternative)**

Separate deployment. Cloudflare free tier: 100K requests/day. Well-documented CORS proxy pattern. Adds operational complexity (separate deploy, separate domain/subdomain).

**3. Vercel Edge Function**

Similar to option 1 but runs on the edge (V8 runtime, no Node.js APIs). Faster cold starts. Use `export const config = { runtime: 'edge' }`. Good fit if the proxy is simple (it is).

### Security Considerations for the Proxy

- Accept ICS URLs via POST body, not query string (avoids logging auth tokens in server logs)
- Allowlist domains: only proxy requests to known calendar providers (iCloud, Google, etc.)
- Rate limit: prevent abuse if the proxy URL is discovered
- iCloud public calendar URLs contain authentication tokens in the URL path; treat them as secrets

### Architecture for Calendar Widget

```
User Config (ICS URLs in site config or env vars)
  → CalendarWidget (Preact component)
    → fetch('/api/calendar-proxy', { method: 'POST', body: { url } })
      → Vercel serverless function fetches ICS from provider
      → Returns ICS text with CORS headers
    → ICAL.parse(icsText) via ical.js
    → Filter to today's events
    → Render event list sorted by time
    → (Future) Expose event context for content-aware adaptation
```

### Calendar Config Structure

Add to `src/config/types.ts`:
```typescript
interface CalendarSource {
  name: string;       // "Work", "Personal", "Auburn Football"
  url: string;        // ICS/webcal URL
  color?: string;     // hex color for event dots
}

interface CalendarConfig {
  sources: CalendarSource[];
  refreshMinutes?: number; // default 15
}
```

Calendar sources are global (not per-day), so add to a new `src/config/calendar.ts` or to `defaults.ts`.

### Caching Strategy

- **localStorage cache** with configurable TTL (default 15 min)
- Cache key: hash of ICS URL
- On page load: render cached data immediately, fetch fresh data in background
- Stale-while-revalidate pattern for seamless UX
- Manual refresh button in the widget UI

### iCloud-Specific Notes

- Public calendar URL format: `webcal://p##-caldav.icloud.com/published/2/...`
- The `webcal://` scheme is just `https://` with a different protocol prefix; the proxy should normalize it
- Must enable "Public Calendar" sharing in iCloud settings per calendar
- Family and Birthday calendars **cannot** be exported via ICS (Apple limitation)
- Apple periodically changes server configs; URLs may need re-sharing

### Content-Aware Adaptation (Stretch Goal)

Issue #2 describes using calendar data to influence the dashboard. Recommended approach for later implementation:

**Rule-based matching:**
```typescript
interface CalendarRule {
  match: RegExp | string;  // match against event title
  promote?: string[];      // link section IDs to promote
  suppress?: string[];     // link section IDs to hide
}
```

Examples: If event title matches "Auburn", promote sports sections. If 3+ meetings today, suppress betting/social sections.

This is a Phase 2 concern. MVP should display events only.

---

## Backlog Assessment

Current backlog items from `.factory/strategy/backlog.md`:
1. "Enable GitHub Pages in repository settings" : **Obsolete.** Site is on Vercel now, not GitHub Pages.
2. "Default weather location" : **Done** (defaults.ts has London fallback).
3. "Personalize quick links" : **This is Issue #1.** Actionable.
4. "Port personalized links from old site" and "add calendar widget" : **These are Issues #1 and #2.** Actionable, the focus of this research.

---

## Recommended Implementation Order

1. **Issue #1 first**: Port links, add `LinkSection` type, update QuickLinksWidget. No external dependencies, no proxy needed, immediate user value.
2. **Issue #2 second**: Add `ical.js` dependency, create Vercel API proxy, build CalendarWidget. Depends on having the link sections in place if content-aware adaptation is desired later.

## Complexity Assessment

- **Issue #1**: Low complexity. Type change + config population + widget UI update. ~3 files changed, ~7 files with new link data. No new dependencies.
- **Issue #2 (MVP)**: Medium complexity. New npm dependency (ical.js), new serverless function (api/calendar-proxy.ts), new widget component, new config type, localStorage caching logic. ~6-8 new/changed files.
- **Issue #2 (Content-aware)**: High complexity. Rule engine, integration between calendar data and link sections, dynamic layout changes. Defer to separate cycle.

## References

- [ical.js GitHub](https://github.com/mozilla-comm/ical.js/)
- [ical.js docs](https://kewisch.github.io/ical.js/)
- [Cloudflare Workers CORS proxy docs](https://developers.cloudflare.com/workers/examples/cors-header-proxy/)
- [Vercel CORS guide](https://vercel.com/kb/guide/how-to-enable-cors)
- [Vercel Functions docs](https://vercel.com/docs/functions)
- [gabanz/whenidontwork: Serverless ICS on Cloudflare Workers](https://github.com/gabanz/whenidontwork)
- [CORS proxy with Cloudflare Workers](https://rednafi.com/javascript/cors-proxy-with-cloudflare-workers/)
- [ICS-powered web app with Azure proxy](https://bexelbie.com/2026/02/18/online-compact-calendar)
- [Astro Vercel adapter docs](https://docs.astro.build/en/guides/integrations-guide/vercel/)
