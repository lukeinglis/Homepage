## Strategy — 2026-05-02

### Observations
- Current composite score: 0.47
- Weakest eval dimension: type_check (0.0, 108 pre-existing errors)
- No experiments yet (first cycle for this target)
- Site deploys on Vercel with Astro static output. 7 day configs exist with flat `quickLinks` arrays (4 generic links each). Old site had ~30 categorized links across 6 sections.
- Two open GitHub issues filed by the owner: #1 (port links) and #2 (calendar widget). Both are the focus target.
- Observability: 0.0%, but this is a static personal dashboard with no server-side request handling. Not actionable this cycle.

### Hypotheses

#### H1: Port categorized links from old site and add calendar widget with ICS proxy
- **Category:** EXPLORE
- **Type:** code
- **Backlog item:** Port personalized links from old site into day configs (GitHub issue #1) and add calendar widget with ICS support and content-aware adaptation (GitHub issue #2)
- **Addresses:** #1, #2
- **Growth dimension:** capability_surface
- **What:** Two connected pieces of work in one PR:

  **Part 1 (Issue #1): Link sections and data population**
  1. Add `LinkSection` interface to `src/config/types.ts`: `{ title: string; icon?: string; links: QuickLink[] }`. Add optional `linkSections?: LinkSection[]` to `DayConfig`.
  2. Update `QuickLinksWidget` to render `linkSections` below the existing `quickLinks` row. Each section gets a collapsible header and its links grid. Falls back gracefully when `linkSections` is undefined.
  3. Populate all 7 day configs with categorized links from `old-site-reference/config/sites.json`:
     - **Weekdays (Mon-Fri):** quickLinks top row (Gmail, Calendar, LinkedIn, DraftKings). Sections: Socials (Twitter/X, Instagram, Reddit, YouTube), Professional (Gmail, Yahoo Mail, LinkedIn).
     - **Saturday:** quickLinks top row (DraftKings, ESPN, Action Network, Reddit). Sections: Socials, Sports News (Auburn On3, Auburn Board, Chelsea FC), Sports Betting (DraftKings, Action Network, KenPom, ETR, Fantasy Labs), Fantasy Sports (ESPN Fantasy Baseball, Yahoo FF, Sleeper).
     - **Sunday:** All 6 sections from sites.json (most populated day, matching old site day-7 pattern). quickLinks top row same as Saturday.
  4. Verify exact link URLs and icons against `old-site-reference/config/sites.json`. Use Lucide icon names from old config where available.

  **Part 2 (Issue #2 MVP): Calendar widget with ICS support**
  1. Install `ical.js` (`npm install ical.js`).
  2. Create `api/calendar-proxy.ts` at project root: Vercel serverless function that accepts POST with `{ url: string }`, fetches the ICS feed (normalizing `webcal://` to `https://`), returns text with CORS headers. Allowlist calendar provider domains (icloud.com, google.com, apple.com). Keep Astro `output: 'static'`.
  3. Add `CalendarSource` and `CalendarConfig` interfaces to `src/config/types.ts`. Create `src/config/calendar.ts` with empty sources array (user will add their ICS URLs after deploy).
  4. Build `CalendarWidget.tsx` (Preact): fetches ICS via the proxy, parses with `ICAL.parse()`, filters to today's events, sorts by start time, renders a compact event list with time and title. Implements localStorage caching with 15-minute TTL and stale-while-revalidate pattern. Shows loading skeleton, empty state ("No events today"), and error fallback.
  5. Add CalendarWidget to `index.astro` widget grid with `client:load`.
  6. Add tests for: LinkSection rendering in QuickLinksWidget, CalendarWidget loading/error/empty states, ICS parsing logic (mock ICS data), calendar proxy URL validation/allowlist.

  **Explicitly deferred:** Content-aware adaptation (calendar events influencing which link sections appear). This is a future cycle item per CEO direction.

- **Why:** These are the only two open issues, both filed by the owner. Issue #1 restores the old site's most-used feature (categorized bookmarks). Issue #2 adds a new capability (live calendar). Combined because they share config/widget infrastructure and the link section structure created for #1 is the prerequisite for future content-aware adaptation from #2. Research confirms ical.js as the right library (zero deps, browser-native, full RFC 5545) and the Vercel `api/` directory approach keeps Astro static.
- **Expected impact:** capability_surface 0.0 -> 0.3 (two new widget capabilities, rich config data across all 7 days). Tests and coverage should hold or improve with new test coverage included.
- **Priority:** high

### Anti-patterns to Avoid
- Do not switch Astro to SSR/hybrid output. CEO explicitly stated Astro must stay static. The calendar proxy uses Vercel's standalone `api/` directory, independent of Astro's build mode.
- Do not attempt content-aware adaptation this cycle. CEO deferred it.
- Do not add Finance section links with placeholder URLs. Only port links where real URLs exist in the old config files.
- Do not add the optional `ical.timezones.js` addon. Most calendar feeds include embedded VTIMEZONE data. Skip to keep bundle size down.
- Do not put ICS URLs directly in source code. They contain auth tokens (especially iCloud). Use `calendar.ts` config with placeholder comments directing the user to add their own URLs.
