## Strategy — 2026-05-02

### Observations
- Current composite score: 0.47
- Weakest eval dimensions: type_check (0.0, 108 pre-existing TS7026 errors), capability_surface (0.0)
- Last experiment: #1 (links + calendar widget), kept, no delta recorded
- Pattern: Score is held down by pre-existing type_check issues and undetected capability_surface. The site works but has visual polish gaps: weather widget blank on light backgrounds, notes textarea unstyled, favicon static across all day themes.
- 10 open GitHub issues. CEO FEEC analysis prioritizes #5 and #6 as FIX, #12 as small EXPLORE. Larger issues (#7, #8, #9, #10, #11, #1, #2) are blocked, need user input, or are too large for this cycle.
- All three target issues share a common pattern: missing CSS definitions for existing class names. The skeleton, textarea, and favicon elements exist in markup but lack styling.

### Hypotheses

#### H1: Fix weather blank state, style notes textarea, add per-day favicon
- **Category:** FIX
- **Backlog item:** Please fix open issues, in order that makes sense
- **Addresses:** #5, #6, #12
- **What:** Three scoped CSS/UI fixes in one PR:

  **#5 Weather blank state (FIX):**
  1. Add skeleton animation CSS in Layout.astro for `.skeleton-line`, `.skeleton-temp`, `.skeleton-detail`: semi-transparent background using `rgba(var(--color-text-rgb), 0.1)`, pulse keyframe animation, explicit height/width so elements are visible on all light day backgrounds.
  2. Change `.weather-error` text color from `var(--color-secondary)` to `var(--color-text)` for WCAG AA contrast on denied/timeout states.
  3. Add subtle border or background tint to the weather widget card in its loading/error states so the blank box is distinguishable.

  **#6 Notes textarea styling (FIX):**
  1. Add `.notes-textarea` CSS in Layout.astro: `background: var(--color-background)`, `color: var(--color-text)`, `border: 1px solid var(--color-accent)`, `border-radius` matching widget cards (0.75rem), `padding: 1rem`, `font-family: inherit`, `resize: vertical`, `min-height: 120px`.
  2. Add focus state: `outline: 2px solid var(--color-primary)`, `outline-offset: 2px` for keyboard accessibility.
  3. Add placeholder text styling with reduced opacity.

  **#12 Per-day favicon (EXPLORE):**
  1. Add a small inline `<script>` in Layout.astro that reads `document.documentElement.dataset.day` on page load.
  2. Build an SVG string using the computed `--color-primary` CSS variable value (a simple colored circle or rounded square).
  3. Set it as the favicon via `link[rel="icon"]` href using a `data:image/svg+xml` URI.
  4. No static favicon files per day needed. Falls back to existing `/favicon.svg` if script fails.

- **Why:** These are the three smallest, most independent issues from the CEO's FEEC analysis. #5 is a visibility bug (skeleton/error invisible on light backgrounds). #6 is a styling deficiency (textarea uses raw browser defaults). #12 is a small cosmetic feature (favicon matches daily theme). They share a common surface (Layout.astro CSS + minor component tweaks) and don't conflict. All are pure frontend CSS/JS with no dependencies, no new packages, and no architectural changes.
- **Expected impact:** No direct composite eval score change (type_check 0.0 and capability_surface 0.0 are the bottlenecks, and these fixes target visual polish not scored dimensions). However, closing 3 GitHub issues improves user-facing quality and unblocks growth work in subsequent cycles. Tests should hold steady (these are CSS changes, not logic changes).
- **Priority:** high

### Anti-patterns to Avoid
- Don't try to fix type_check errors (108 pre-existing TS7026) in the same PR as UI fixes. That's a separate effort requiring tsconfig or type declaration changes.
- Don't add geolocation coordinate changes (#7) without user input on their actual location.
- Don't attempt dark mode (#8), PWA (#11), or search bar (#9) alongside these small fixes. Those are architectural changes needing dedicated cycles.
- Don't over-engineer the favicon: an inline SVG data URI is simpler and more reliable than generating static files per day or adding build-time favicon generation.
- Don't add JavaScript-based skeleton animations when CSS keyframes suffice. Keep the loading state pure CSS for performance.
