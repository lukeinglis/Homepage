---
tags:
  - factory
  - research
  - personal-website
  - calendar
  - cors
topic: CORS proxy via Vercel API route for ICS calendar feeds
date: 2026-05-02
source: factory-archivist
---

# CORS Proxy via Vercel API Route

## The Problem
Calendar providers (iCloud, Google) do not send `Access-Control-Allow-Origin` headers on ICS feed responses. Browser `fetch()` calls from a different origin are blocked. Calendar feeds are designed for server-side consumption, not browser JavaScript. **No frontend-only workaround exists.**

## Recommended Solution: Vercel API Route (Option 1a)

Create `api/calendar-proxy.ts` at the project root. Vercel auto-deploys files in `api/` as serverless functions. This keeps Astro fully static (`output: 'static'`), no adapter change needed.

### Alternatives Considered
| Option | Fit | Trade-off |
|--------|-----|-----------|
| **Vercel API route** | Best | Already on Vercel, ~15 lines |
| Astro SSR (hybrid) | Good | Changes deployment model |
| Cloudflare Worker | Good | Separate deploy, separate domain |
| Vercel Edge Function | Good | V8 runtime, no Node APIs |

### Security Requirements
- Accept ICS URLs via POST body (not query string, avoids logging auth tokens)
- Allowlist domains: only proxy to known calendar providers (iCloud, Google)
- Rate limit to prevent abuse
- iCloud public calendar URLs contain auth tokens in path: treat as secrets

### iCloud-Specific Notes
- Public URL format: `webcal://p##-caldav.icloud.com/published/2/...`
- `webcal://` is just `https://` with different protocol prefix; proxy normalizes
- Must enable "Public Calendar" sharing per calendar in iCloud settings
- Family and Birthday calendars cannot be exported via ICS (Apple limitation)
- Apple periodically changes server configs; URLs may need re-sharing

## References
- [Vercel CORS guide](https://vercel.com/kb/guide/how-to-enable-cors)
- [Vercel Functions docs](https://vercel.com/docs/functions)
- [Cloudflare Workers CORS proxy](https://developers.cloudflare.com/workers/examples/cors-header-proxy/)
- [gabanz/whenidontwork: Serverless ICS on Cloudflare](https://github.com/gabanz/whenidontwork)
- [CORS proxy with Cloudflare Workers](https://rednafi.com/javascript/cors-proxy-with-cloudflare-workers/)
- [ICS web app with Azure proxy](https://bexelbie.com/2026/02/18/online-compact-calendar)

## Relevance
Core infrastructure for [[personal-website]] Issue #2 calendar widget. The proxy is the enabling piece that makes browser-side ICS parsing possible.
