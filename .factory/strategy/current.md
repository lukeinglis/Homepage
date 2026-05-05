## Strategy — 2026-05-04

### Observations
- Current composite score: 0.47 (threshold 0.45)
- Weakest eval dimensions: capability_surface (0.0), observability (0.0), type_check (0.0), research_grounding (0.0)
- Last 2 experiments: both kept (100% keep rate). Exp 1: links + calendar widget (feature). Exp 2: UI polish fixes #5, #6, #12 (bugfix).
- Pattern: Project has solid hygiene (tests 1.0, guard_patterns 1.0, config_parser 1.0) but zero growth dimension scores. All growth dimensions are at 0.0 or 0.5. The project is functionally working but architecturally stale: 7 day-themes, flat widget grid, no scene system.
- Focus: Issue #15 is a complete visual + architectural redesign. The design prototype (11 JSX files, 2988 lines) defines the target state exactly. This is the largest single change in the project's history.

### Hypotheses

#### H1: Port scene-based dashboard prototype to Astro + Preact
- **Category:** EXPLORE
- **Type:** code
- **Backlog item:** Redesign: Scene-based dashboard with glassmorphism UI
- **Addresses:** #15
- **What:** Port the complete design prototype from `.factory/design-reference/src/` (11 React JSX files, ~3000 lines) to the production Astro + Preact + TypeScript stack. This replaces the current 7 day-theme widget system with a 4-scene layout (weekday AM/PM, weekend AM/PM) featuring glassmorphism UI, animated gradient backgrounds, Cmd+K command palette, scene/team-night switchers, and ~30 content modules across 5 categories (Work, Sports, Cooking, Life, Navigation).
- **Implementation spec:** The `.factory/design-reference/src/` files ARE the spec. Port each file:
  - `app.jsx` to `src/components/scenes/App.tsx`: Top-level scene orchestration (scene state, team-night state, keyboard shortcuts, transitions). Use Preact `useState`/`useEffect` instead of `React.useState`/`React.useEffect`. Mount as single `client:load` island in `index.astro`.
  - `scenes.jsx` to `src/components/scenes/Scenes.tsx`: 4 scene layout components (SceneWeekdayAM, SceneWeekdayPM, SceneWeekendAM, SceneWeekendPM) + SceneShell wrapper. Replace `window.MY_TEAMS_DETAIL` globals with TypeScript imports.
  - `backgrounds.jsx` to `src/components/scenes/Backgrounds.tsx`: 7 animated gradient background components (4 scenes + 3 team nights, 857 lines of CSS keyframe animations). Preserve exact gradient colors, orb sizes, animation timings.
  - `cmdk.jsx` to `src/components/scenes/CmdK.tsx`: Command palette with fuzzy search across all bookmark categories. Replace `window.BOOKMARKS_*` globals with TypeScript data imports.
  - `data.jsx` to `src/data/scene-data.ts`: All static data (bookmarks, teams, recipes, calendar events, news, quotes, groceries, weather mock). Convert from `window.*` globals to typed exports.
  - `modules-work.jsx` to `src/components/modules/WorkModules.tsx`: MeetingTimeline, ProjectsModule, InboxModule, WorkCalendar, DevQuicklaunch, WorkShortcuts, RedHatNews, MarketsModule, NetWorthModule
  - `modules-sports.jsx` to `src/components/modules/SportsModules.tsx`: SportsBoard, MyTeamsRail, TeamDeepDive, FantasyModule, EventTakeover, ScoreRecap
  - `modules-cooking.jsx` to `src/components/modules/CookingModules.tsx`: TonightHero, WeekendMealPlan, GroceriesModule
  - `modules-life.jsx` to `src/components/modules/LifeModules.tsx`: PersonalCalendar, WeatherModule, NotesModule, QuoteModule, StreamingShelf, YouTubeFrame, YouTubeQueue, NowPlaying, NewsModule, SeasonalNote, ShoppingModule
  - `modules-extra.jsx` to `src/components/modules/ExtraModules.tsx`: Greeting, PinnedRow + shared UI primitives (Chip, Module wrapper, Icon proxy)
  - `icons.jsx` to `src/components/scenes/Icons.tsx`: Lucide icon component (inline SVG paths)
  - New: `src/styles/scenes.css`: Global CSS for glassmorphism system (`.module` cards with `backdrop-filter: blur(16px)`, `.chip` pills, `.kbd` key indicators, scene-scoped color overrides for `.scene-wkdy-am`, `.scene-wknd-am`, team overrides `.team-auburn`, `.team-chelsea`, `.team-camden`, grain overlay, scrollbar styling). Extract from inline styles and Tailwind utility classes in the prototype.
  - Update: `src/layouts/Layout.astro`: Add Google Fonts (Newsreader) and Vercel CDN fonts (Geist, Geist Mono) via `<link>` tags. Add CSS custom properties (`--serif`, `--sans`, `--mono`). Import `scenes.css`.
  - Update: `src/pages/index.astro`: Replace the current day-theme widget grid with a single `<App client:load />` island. Remove old widget imports and day-config loader. The scene system handles all rendering internally.
- **Key translation rules:**
  - `React.useState` to `useState` from `preact/hooks`
  - `React.useEffect` to `useEffect` from `preact/hooks`
  - `React.useRef` to `useRef` from `preact/hooks`
  - `React.useCallback` to `useCallback` from `preact/hooks`
  - `className` stays as `className` (Preact supports it)
  - `style={{}}` inline objects stay the same (Preact supports them)
  - `ReactDOM.createRoot` removed (Astro `client:load` handles mounting)
  - `window.*` globals become TypeScript module imports with explicit types
  - JSX becomes TSX with proper type annotations on props
  - All Tailwind utility classes preserved exactly (already in the project via CDN or config)
- **What NOT to change:** All visual design decisions (colors, spacing, typography, gradients, animations, layout grid proportions) must be preserved exactly from the prototype. The Builder is translating React to Preact, not redesigning.
- **Existing widgets:** The current widgets (ClockWidget, WeatherWidget, QuickLinksWidget, CalendarWidget, QuoteWidget, NotesWidget) are superseded by scene modules. The scene system has its own WeatherModule, PersonalCalendar, NotesModule, QuoteModule, etc. with different designs. Keep old widget files in the repo (don't delete) but they will no longer be rendered by `index.astro`.
- **Auto-scene detection:** Add logic in App.tsx to detect the correct initial scene based on current day/time: weekday (Mon-Fri) vs weekend (Sat-Sun), AM (before 5pm) vs PM (5pm+). Override via scene switcher UI.
- **Why:** Issue #15 is the user's primary design vision. The prototype was built in Claude Design and represents the complete target UX. All 30 modules use static/mock data, so no API integrations are needed. This is a pure frontend port: translate React JSX to Preact TSX while preserving the visual design exactly. Cross-project insights show 100% keep rate on both feature and bugfix experiments, supporting this larger scope change.
- **Expected impact:** capability_surface 0.0 to 0.3+ (30+ new modules, 4 scene components, command palette, switcher UIs), experiment_diversity 0.5 to 0.6 (novel experiment type: full redesign)
- **Priority:** high

### Anti-patterns to Avoid
- Do not redesign or "improve" the prototype's visual decisions. The prototype IS the spec. Port it faithfully.
- Do not add API integrations for modules (weather API, calendar API, etc.) in this experiment. All data is static/mock. Live integrations are follow-up work.
- Do not try to reuse existing widget components inside the scene system. The scene modules have their own distinct designs.
- Do not remove old widget files or config files. They can be cleaned up in a follow-up cycle after the redesign is validated.
- Previous experiments focused on incremental widget fixes. This is intentionally a larger scope (EXPLORE) because the redesign touches every visual surface.
- Do not attempt to fix the 150 pre-existing TypeScript errors in existing files. Focus only on making the new scene files type-clean.
