# Researcher Agent Output

- **timestamp:** 2026-05-02T20:21:01Z
- **exit_code:** 0

---

Research complete. Written to `.factory/strategy/research.md` with findings on all four topics:

1. **Old site link structure**: JSON configs with 6 categorized sections, ~30 links. Current site has only 4 flat links per day. Recommend adding `LinkSection` type to restore categorized organization.

2. **ICS parsing library**: **ical.js** (v2.2.1) is the clear winner. Zero deps, browser-native, full RFC 5545 with recurrence support, Mozilla-backed.

3. **CORS for ICS feeds**: No frontend workaround exists. Best option is a **standalone Vercel API route** (`api/calendar-proxy.ts`) that keeps Astro fully static while proxying ICS fetches server-side. ~15 lines of code.

4. **Current day config structure**: `DayConfig` has `quickLinks: QuickLink[]` (name, url, icon). Widget system is hardcoded in `index.astro`, not dynamic. Adding a calendar widget follows the same pattern: create component, import in index.astro, wrap in WidgetWrapper.
