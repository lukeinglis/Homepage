---
tags:
  - factory
  - research
  - personal-website
  - calendar
topic: ical.js as the ICS parsing library for calendar widget
date: 2026-05-02
source: factory-archivist
---

# ical.js: ICS Parsing Library

## Source
Library comparison for Issue #2 (Calendar Widget).

## Selection: ical.js (kewisch)

**Winner by every metric:**
- Browser-native (no Node.js required)
- Zero dependencies
- Full RFC 5545 (iCalendar) and RFC 7265 (jCal) support
- Full RRULE, RDATE, EXDATE recurrence expansion via `RecurExpansion` class
- TypeScript types available
- Mozilla-backed, current version v2.2.1
- Import: `import ICAL from "ical.js"` or via unpkg CDN

### Alternatives Rejected
| Library | Reason |
|---------|--------|
| node-ical | Node.js only, many deps |
| cal-parser | Partial RFC support, low maturity |
| tsdav | CalDAV client, not a parser |

### Notes
- Timezone support via optional `ical.timezones.js` addon (adds bundle size)
- Skip timezone addon if events have embedded VTIMEZONE data (most do)

## References
- [ical.js GitHub](https://github.com/mozilla-comm/ical.js/)
- [ical.js docs](https://kewisch.github.io/ical.js/)

## Relevance
Required dependency for [[personal-website]] Issue #2 calendar widget. Install via `npm install ical.js`.
