export const TODAY = new Date(2026, 4, 7);

export interface Meeting {
  t: string;
  end: string;
  title: string;
  type: "team" | "1on1" | "ext" | "focus" | "break" | "open";
  join?: boolean;
}

export const MEETINGS: Meeting[] = [
  { t: "08:30", end: "09:00", title: "Daily standup — AI Innovation", type: "team", join: true },
  { t: "09:00", end: "10:00", title: "Focus block — ITS Hub design doc", type: "focus" },
  { t: "10:00", end: "10:30", title: "1:1 with manager", type: "1on1", join: true },
  { t: "10:30", end: "11:00", title: "Training Hub sprint review", type: "team", join: true },
  { t: "11:00", end: "12:00", title: "External — partner design session", type: "ext", join: true },
  { t: "12:00", end: "13:00", title: "Lunch / break", type: "break" },
  { t: "13:00", end: "14:00", title: "SDG Hub architecture review", type: "team", join: true },
  { t: "14:00", end: "15:00", title: "Focus block — Q3 OKR draft", type: "focus" },
  { t: "15:00", end: "15:30", title: "Hiring loop — Sr. PM, AI Platform", type: "team", join: true },
  { t: "15:30", end: "16:00", title: "Open", type: "open" },
  { t: "16:00", end: "17:00", title: "Exec readout — AI Innovation platform", type: "ext", join: true },
];

export interface Project {
  name: string;
  status: string;
  pct: number;
  last: string;
  tag: string;
}

export const PROJECTS: Project[] = [
  { name: "Training Hub — GA readiness", status: "On track", pct: 82, last: "2h ago", tag: "AI Innovation" },
  { name: "SDG Hub — multi-model support", status: "On track", pct: 65, last: "yesterday", tag: "AI Innovation" },
  { name: "ITS Hub — inference-time scaling", status: "At risk", pct: 38, last: "3h ago", tag: "AI Innovation" },
  { name: "Customer Council — May cohort", status: "On track", pct: 62, last: "yesterday", tag: "GTM" },
];

export interface Note {
  title: string;
  ago: string;
}

export const NOTES: Note[] = [
  { title: "2026-05-07 — daily", ago: "today" },
  { title: "ITS Hub — scaling architecture v2", ago: "yest" },
  { title: "Training Hub launch checklist", ago: "2d" },
  { title: "Reading — inference-time compute", ago: "4d" },
];

export const INBOX = {
  unread: 18,
  flagged: 3,
  top: [
    { from: "AI Innovation Lead", subj: "Re: ITS Hub — exec readout deck", when: "07:42" },
    { from: "Partner PM", subj: "Design session agenda — questions", when: "07:11" },
    { from: "Eng All-Hands", subj: "Friday demo signups close today", when: "06:58" },
  ],
};

export const MY_TEAMS = ["AUB", "BAL", "CHE", "TB", "MIN"];

export interface Game {
  lg: string;
  away: string;
  home?: string;
  aw?: number;
  hs?: number;
  state: string;
  live: boolean;
  net: string;
  stakes: string;
  mine?: boolean;
}

export const GAMES: Record<string, Game[]> = {
  weekday_evening: [
    { lg: "mlb", away: "BAL", home: "TOR", aw: 4, hs: 3, state: "T7", live: true, net: "MASN", stakes: "AL East", mine: true },
    { lg: "nba", away: "MIN", home: "DEN", aw: 78, hs: 81, state: "Q3 4:12", live: true, net: "TNT", stakes: "Play-in implications", mine: true },
    { lg: "nba", away: "BOS", home: "MIA", aw: 92, hs: 88, state: "Q4 6:48", live: true, net: "ESPN", stakes: "East 2-seed" },
    { lg: "mlb", away: "LAD", home: "SFG", aw: 2, hs: 2, state: "B5", live: true, net: "ESPN+", stakes: "NL West" },
    { lg: "epl", away: "CHE", home: "ARS", aw: 1, hs: 1, state: "78'", live: true, net: "USA", stakes: "Top 4 race", mine: true },
    { lg: "nhl", away: "FLA", home: "TOR", aw: 0, hs: 0, state: "7:30 ET", live: false, net: "TNT", stakes: "Round 2 Game 4" },
  ],
  weekend_morning: [
    { lg: "pga", away: "Masters R3 — Augusta National", state: "LIVE", live: true, net: "ESPN+", stakes: "S. Scheffler -11 leads" },
    { lg: "epl", away: "MNC", home: "CHE", aw: 1, hs: 2, state: "62'", live: true, net: "USA", stakes: "Title race", mine: true },
    { lg: "epl", away: "LIV", home: "ARS", aw: 0, hs: 0, state: "10:00 ET", live: false, net: "Peacock", stakes: "Big 4" },
    { lg: "f1", away: "Miami GP — Qualifying", state: "Q3 LIVE", live: true, net: "F1 TV", stakes: "Verstappen P1 prov." },
    { lg: "cfb", away: "AUB", home: "GA", aw: 0, hs: 0, state: "3:30 ET", live: false, net: "CBS", stakes: "Iron Bowl tune-up", mine: true },
    { lg: "mlb", away: "BAL", home: "BOS", aw: 0, hs: 0, state: "1:35 ET", live: false, net: "MASN", stakes: "AL East", mine: true },
    { lg: "tns", away: "Madrid Open — SF, Alcaraz vs. Sinner", state: "9:00 ET", live: false, net: "Tennis Channel", stakes: "Clay tune-up" },
    { lg: "ucl", away: "RM", home: "BAY", aw: 0, hs: 0, state: "3:00 ET", live: false, net: "Paramount+", stakes: "UCL semi 2nd leg" },
  ],
  weekend_evening: [
    { lg: "pga", away: "Masters R3 — Final groups out", state: "FINAL R3", live: false, net: "ESPN+", stakes: "Scheffler -14 leads by 2" },
    { lg: "nba", away: "MIN", home: "DEN", aw: 0, hs: 0, state: "8:30 ET", live: false, net: "TNT", stakes: "WCSF Game 4", mine: true },
    { lg: "ufc", away: "UFC 322 — Pereira vs. Ankalaev 2", state: "Main 10pm", live: false, net: "ESPN+ PPV", stakes: "LHW title" },
    { lg: "mlb", away: "BAL", home: "BOS", aw: 6, hs: 4, state: "FINAL", live: false, net: "MASN", stakes: "W — 4-game sweep", mine: true },
    { lg: "epl", away: "Saturday recap", state: "FT", live: false, net: "Replay", stakes: "Chelsea 2-1 Man City", mine: true },
  ],
};

export interface FantasyLeague {
  league: string;
  name: string;
  rec: string;
  pts: number | string;
  rank: string;
}

export const FANTASY: FantasyLeague[] = [
  { league: "Yahoo — Fantasy Football", name: "War Eagle Express", rec: "5-2", pts: 128.4, rank: "3rd" },
  { league: "ESPN — Fantasy Baseball", name: "Bird-Watchers", rec: "—", pts: "6th of 12", rank: "Henderson hot" },
];

export interface FantasyDeep {
  platform: string;
  sport: string;
  league: string;
  team: string;
  rec: string;
  status: string;
  statusLabel: string;
  note: string;
}

export const FANTASY_DEEP: FantasyDeep[] = [
  { platform: "Yahoo", sport: "NFL", league: "Fantasy Football", team: "War Eagle Express", rec: "5-2 · 3rd", status: "W", statusLabel: "Won wk 7 · 128.4", note: "Jefferson 28.2 · Barkley 22.1. Waiver: target a TE." },
  { platform: "ESPN", sport: "MLB", league: "H2H Categories", team: "Bird-Watchers", rec: "4-3-1 · 6th of 12", status: "P", statusLabel: "Streaming 2 SP", note: "Henderson hot. ROY race tightening." },
];

export const TONIGHT = {
  title: "Braised short ribs over Parmesan polenta",
  prep: 25,
  cook: 175,
  serves: 4,
  start: "5:45 PM",
  ingredients: ["3 lb bone-in short ribs", "2 carrots, leek, celery", "Bottle of dry red", "Beef stock", "Polenta + Parm", "Gremolata"],
  source: "Bon Appétit · adapted",
  note: "Dry overnight, brown hard, low oven 3h.",
};

export interface Recipe {
  title: string;
  min: number;
  src: string;
  saved: string;
}

export const RECIPES: Recipe[] = [
  { title: "Crispy gnocchi with brown butter & sage", min: 25, src: "NYT Cooking", saved: "Apr 22" },
  { title: "Chongqing-style chili oil, twice-cooked", min: 60, src: "Made With Lau", saved: "Apr 18" },
  { title: "Salt-and-pepper smashed cucumbers", min: 10, src: "Lucas Sin", saved: "Apr 14" },
  { title: "Buttermilk roast chicken, schmaltz potatoes", min: 90, src: "Serious Eats", saved: "Apr 09" },
  { title: "Sourdough discard pancakes", min: 15, src: "King Arthur", saved: "Mar 30" },
];

export interface GroceryItem {
  x: boolean;
  t: string;
}

export const GROCERIES: GroceryItem[] = [
  { x: false, t: "Bone-in short ribs (3 lb)" },
  { x: false, t: "Polenta (coarse)" },
  { x: false, t: "Parmigiano-Reggiano wedge" },
  { x: true, t: "Carrots, leek, celery" },
  { x: true, t: "Dry red wine — anything Italian" },
  { x: false, t: "Flat-leaf parsley, lemon" },
];

export interface CookVideo {
  title: string;
  ch: string;
  dur: string;
}

export const COOK_VIDEOS: CookVideo[] = [
  { title: "Kenji — The science of braising, in 12 minutes", ch: "J. Kenji López-Alt", dur: "12:04" },
  { title: "Ethan Chlebowski — Why polenta is better than mash", ch: "Ethan Chlebowski", dur: "9:41" },
  { title: "Adam Ragusea — Sunday gravy, Tuesday energy", ch: "Adam Ragusea", dur: "14:27" },
];

export interface MarketData {
  sym: string;
  val: string;
  chg: string;
  color: string;
  data: number[];
}

export const MARKETS: MarketData[] = [
  { sym: "S&P 500", val: "5,284.42", chg: "+0.42%", color: "#4ade80", data: [62,64,63,65,66,64,67,68,66,69,70,68] },
  { sym: "NASDAQ", val: "16,842.10", chg: "+0.71%", color: "#4ade80", data: [58,60,59,62,63,61,64,65,63,66,68,67] },
  { sym: "DOW", val: "38,912.05", chg: "-0.08%", color: "#f87171", data: [70,69,71,70,68,69,67,68,70,69,68,67] },
  { sym: "10Y", val: "4.42%", chg: "+3 bps", color: "#4ade80", data: [44,43,44,45,44,43,44,45,44,43,44,44] },
];

export interface StockData {
  sym: string;
  val: string;
  chg: string;
  color: string;
}

export const STOCKS: StockData[] = [
  { sym: "MGM", val: "38.11", chg: "-0.26%", color: "#f87171" },
  { sym: "PENN", val: "16.83", chg: "+0.48%", color: "#4ade80" },
  { sym: "DAL", val: "73.24", chg: "-0.14%", color: "#f87171" },
  { sym: "GE", val: "303.92", chg: "-0.63%", color: "#f87171" },
  { sym: "GEV", val: "1,068.00", chg: "-4.55%", color: "#f87171" },
  { sym: "JD", val: "30.26", chg: "-1.40%", color: "#f87171" },
  { sym: "GEHC", val: "61.41", chg: "-0.51%", color: "#f87171" },
  { sym: "HIVE", val: "2.84", chg: "-3.35%", color: "#f87171" },
  { sym: "SNDL", val: "1.43", chg: "-0.69%", color: "#f87171" },
];


export const NEWS: Record<string, string[]> = {
  bloomberg: [
    "Fed minutes: officials see only one cut on the table for 2026",
    "Nvidia order book stretches to mid-2027 as enterprises queue",
    "Boeing names new COO; restructuring of defense unit accelerates",
  ],
  hn: [
    "Show HN: a tiny vector DB that fits in 200 lines of Rust  (412)",
    "The end of cheap context windows  (988)",
    "Why 'agentic' benchmarks lie — a postmortem  (276)",
  ],
  nyt: [
    "A weekend in the Hudson Valley, and the new American inn",
    "How a small Maine town became a Michelin pilgrimage",
    "The Sunday Read: forty years of the open kitchen",
  ],
  espn: [
    "Masters Sunday: Scheffler holds 2 over McIlroy entering R4",
    "Wolves take 2-1 lead on Nuggets behind Edwards 38",
    "Chelsea scrap past Man City; Palmer brace lifts Blues",
  ],
  cnn: [
    "Storm system pushes east; New England braces for evening rain",
    "Senate readies vote on AI safety framework next week",
    "Heat dome to settle over Southwest by mid-week",
  ],
};

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: "The obstacle is the way.", author: "Marcus Aurelius" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "It is not the critic who counts.", author: "Theodore Roosevelt" },
  { text: "Hard choices, easy life. Easy choices, hard life.", author: "Jerzy Gregorek" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "You miss 100% of the shots you do not take.", author: "Wayne Gretzky" },
  { text: "War Eagle.", author: "Auburn Creed" },
  { text: "Do not judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Fortune favors the bold.", author: "Virgil" },
  { text: "What gets measured gets managed.", author: "Peter Drucker" },
  { text: "Pressure is a privilege.", author: "Billie Jean King" },
  { text: "The more I practice, the luckier I get.", author: "Gary Player" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
];

export interface Bookmark {
  cat: string;
  name: string;
  url: string;
}

export const BOOKMARKS: Bookmark[] = [
  { cat: "Work", name: "Gmail (work)", url: "mail.google.com" },
  { cat: "Work", name: "Google Calendar", url: "calendar.google.com" },
  { cat: "Work", name: "Drive", url: "drive.google.com" },
  { cat: "Work", name: "Slack", url: "redhat.slack.com" },
  { cat: "Work", name: "Jira — RHEL AI", url: "issues.redhat.com" },
  { cat: "Work", name: "GitHub — RHEL AI", url: "github.com/redhat-ai" },
  { cat: "Work", name: "Confluence", url: "spaces.redhat.com" },
  { cat: "Work", name: "Obsidian", url: "obsidian://open" },
  { cat: "LLM / Dev", name: "Claude", url: "claude.ai" },
  { cat: "LLM / Dev", name: "ChatGPT", url: "chatgpt.com" },
  { cat: "LLM / Dev", name: "Copilot", url: "github.com/copilot" },
  { cat: "LLM / Dev", name: "Internal — Granite Studio", url: "granite.studio.rh" },
  { cat: "Cooking", name: "NYT Cooking", url: "cooking.nytimes.com" },
  { cat: "Cooking", name: "Serious Eats", url: "seriouseats.com" },
  { cat: "Cooking", name: "Bon Appétit", url: "bonappetit.com" },
  { cat: "Cooking", name: "Kenji — YouTube", url: "youtube.com/@JKenjiLopezAlt" },
  { cat: "Cooking", name: "Instacart", url: "instacart.com" },
  { cat: "Sports — Teams", name: "ESPN", url: "espn.com" },
  { cat: "Sports — Teams", name: "The Athletic", url: "nytimes.com/athletic" },
  { cat: "Sports — Teams", name: "On3 — Auburn", url: "on3.com/auburn" },
  { cat: "Sports — Teams", name: "Chelsea FC", url: "chelseafc.com" },
  { cat: "Sports — Teams", name: "Premier League", url: "premierleague.com" },
  { cat: "Sports — Teams", name: "NFL.com", url: "nfl.com" },
  { cat: "Sports — Teams", name: "NBA.com", url: "nba.com" },
  { cat: "Sports — Teams", name: "MLB — Orioles", url: "mlb.com/orioles" },
  { cat: "Sports — Teams", name: "KenPom", url: "kenpom.com" },
  { cat: "Sports — Events", name: "Formula 1", url: "formula1.com" },
  { cat: "Sports — Events", name: "PGA Tour", url: "pgatour.com" },
  { cat: "Sports — Events", name: "ATP / WTA", url: "atptour.com" },
  { cat: "Sports — Events", name: "UFC", url: "ufc.com" },
  { cat: "Sports — Events", name: "BoxRec", url: "boxrec.com" },
  { cat: "Sports — Events", name: "Equibase", url: "equibase.com" },
  { cat: "Streaming — Sports", name: "ESPN+", url: "plus.espn.com" },
  { cat: "Streaming — Sports", name: "Peacock", url: "peacocktv.com" },
  { cat: "Streaming — Sports", name: "Paramount+", url: "paramountplus.com" },
  { cat: "Streaming — Sports", name: "YouTube TV", url: "tv.youtube.com" },
  { cat: "Streaming — Sports", name: "Max", url: "max.com" },
  { cat: "Streaming — Sports", name: "Apple TV — MLS", url: "tv.apple.com" },
  { cat: "Streaming — Sports", name: "F1 TV", url: "f1tv.formula1.com" },
  { cat: "Streaming — General", name: "Netflix", url: "netflix.com" },
  { cat: "Streaming — General", name: "Hulu", url: "hulu.com" },
  { cat: "Streaming — General", name: "Disney+", url: "disneyplus.com" },
  { cat: "Streaming — General", name: "Prime Video", url: "primevideo.com" },
  { cat: "Music & Video", name: "YouTube", url: "youtube.com" },
  { cat: "Music & Video", name: "YouTube Music", url: "music.youtube.com" },
  { cat: "Email", name: "Gmail (personal)", url: "mail.google.com" },
  { cat: "Email", name: "Yahoo Mail", url: "mail.yahoo.com" },
  { cat: "News", name: "Bloomberg", url: "bloomberg.com" },
  { cat: "News", name: "NYT", url: "nytimes.com" },
  { cat: "News", name: "CNN", url: "cnn.com" },
  { cat: "News", name: "Hacker News", url: "news.ycombinator.com" },
  { cat: "Fantasy", name: "Sleeper", url: "sleeper.app" },
  { cat: "Fantasy", name: "ESPN Fantasy", url: "fantasy.espn.com" },
  { cat: "Fantasy", name: "Yahoo Fantasy", url: "football.fantasysports.yahoo.com" },
  { cat: "Finances", name: "Bank", url: "—" },
  { cat: "Finances", name: "Brokerage", url: "—" },
  { cat: "Finances", name: "Budget", url: "—" },
  { cat: "Shopping", name: "Amazon", url: "amazon.com" },
  { cat: "Socials", name: "X", url: "x.com" },
  { cat: "Socials", name: "Instagram", url: "instagram.com" },
  { cat: "Socials", name: "Reddit", url: "reddit.com" },
  { cat: "Professional", name: "LinkedIn", url: "linkedin.com" },
];

export interface QuickAction {
  name: string;
  hint: string;
  url?: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { name: "New Google Doc", hint: "doc", url: "https://docs.google.com/document/d/create" },
  { name: "Start focus block — 50m", hint: "focus" },
  { name: "Play kitchen playlist", hint: "music" },
  { name: "Start cooking mode", hint: "cook" },
  { name: "What's on TV tonight", hint: "tv" },
  { name: "New Obsidian note", hint: "note", url: "obsidian://new" },
  { name: "Open Claude — new chat", hint: "llm", url: "https://claude.ai/new" },
];

export const NOW_PLAYING = {
  title: "Sade Radio",
  artist: "Sade · Maxwell · D'Angelo",
  source: "YouTube Music",
  cover: "linear-gradient(135deg, #5b3a29 0%, #1d1410 60%, #f0a16a 120%)",
};

export interface WatchlistItem {
  title: string;
  svc: string;
  left: string;
  new?: boolean;
}

export const WATCHLIST: WatchlistItem[] = [
  { title: "Severance — S3E2", svc: "Apple TV+", left: "47m", new: true },
  { title: "Reacher — S3E5", svc: "Prime Video", left: "new", new: true },
  { title: "The Bear — S4E1", svc: "Hulu", left: "premiere", new: true },
  { title: "Yellowstone — S5E8", svc: "Peacock", left: "2 ep" },
];

export interface StreamingShow {
  title: string;
  service: string;
  badge: string | null;
  note: string;
}

export const STREAMING: Record<string, StreamingShow[]> = {
  wkdy_pm: [
    { title: "Severance — S3E2", service: "Apple TV+", badge: "NEW", note: "47m left" },
    { title: "Reacher — S3E5", service: "Prime Video", badge: "NEW", note: "new" },
    { title: "The Bear — S4E1", service: "Hulu", badge: null, note: "S4 premiere" },
    { title: "Yellowstone — S5E8", service: "Peacock", badge: null, note: "2 episodes" },
  ],
  wknd_pm: [
    { title: "Severance — S3E2", service: "Apple TV+", badge: "NEW", note: "47m left" },
    { title: "Lioness — S2E4", service: "Paramount+", badge: null, note: "S2E4" },
    { title: "Reacher — S3E5", service: "Prime Video", badge: "NEW", note: "new" },
    { title: "Dark Matter — S2E1", service: "Apple TV+", badge: null, note: "premiere" },
  ],
};

export const RED_HAT_NEWS = [
  "Training Hub GA freeze · Friday EOD",
  "Q3 OKR draft circulated for review",
  "Summit: AI Innovation demo allocations released",
];

export interface TeamDetail {
  abbr: string;
  name: string;
  sport: string;
  record: string;
  cs: [string, string];
  rank: string;
  next: { when: string; line: string; net: string; spread?: string };
  last: { res: string; line: string; note?: string }[];
  stat: [string, string][];
  badge: string;
}

export const MY_TEAMS_DETAIL: TeamDetail[] = [
  {
    abbr: "AUB", name: "Auburn Tigers", sport: "CFB", record: "7-1 (4-1 SEC)",
    cs: ["#03244d", "#e87722"],
    rank: "#9 AP · #7 CFP",
    next: { when: "Today 3:30 ET", line: "vs. Georgia", net: "CBS", spread: "+2.5" },
    last: [
      { res: "W", line: "vs. Texas A&M 31-24", note: "OT thriller" },
      { res: "W", line: "@ Vanderbilt 38-10" },
      { res: "L", line: "vs. Alabama 17-24", note: "Iron Bowl L" },
      { res: "W", line: "vs. Kentucky 27-13" },
      { res: "W", line: "@ Mizzou 21-17" },
    ],
    stat: [["Off", "32.4 ppg"], ["Def", "19.1 ppg"], ["QB", "Arnold · 64% · 18 TD"]],
    badge: "GAMEDAY",
  },
  {
    abbr: "BAL", name: "Baltimore Orioles", sport: "MLB", record: "19-12 (1st AL East)",
    cs: ["#df4601", "#000000"],
    rank: "AL East — 1.5 GB lead",
    next: { when: "Tomorrow 7:05 ET", line: "vs. Boston (Bautista vs. Houck)", net: "MASN" },
    last: [
      { res: "W", line: "vs. BOS 6-4", note: "Henderson 2 HR" },
      { res: "W", line: "vs. BOS 3-1" },
      { res: "W", line: "vs. BOS 7-5", note: "Sweep clincher" },
      { res: "L", line: "@ NYY 2-5" },
      { res: "W", line: "@ NYY 4-2" },
    ],
    stat: [["Henderson", "OPS .932 · 8 HR"], ["Rutschman", "OPS .883"], ["Bullpen", "ERA 2.84"]],
    badge: "WIN STREAK +3",
  },
  {
    abbr: "CHE", name: "Chelsea FC", sport: "EPL", record: "18-7-3 (3rd, 57 pts)",
    cs: ["#034694", "#5fa9e3"],
    rank: "UCL place · 3 pts back of 2nd",
    next: { when: "Today 12:30 ET", line: "vs. Man City (Stamford Bridge)", net: "USA" },
    last: [
      { res: "W", line: "@ Brighton 2-0" },
      { res: "D", line: "vs. Arsenal 1-1", note: "Palmer 89'" },
      { res: "W", line: "@ Forest 3-1" },
      { res: "W", line: "vs. Spurs 4-3", note: "Derby" },
      { res: "L", line: "@ Liverpool 0-2" },
    ],
    stat: [["Palmer", "17 G / 11 A"], ["Jackson", "12 G"], ["xG diff", "+1.4 / match"]],
    badge: "MATCHDAY",
  },
  {
    abbr: "TB", name: "Tampa Bay Buccaneers", sport: "NFL", record: "4-3 (2nd NFC South)",
    cs: ["#a71930", "#322f2b"],
    rank: "In the hunt · NFC South tight",
    next: { when: "Sun Nov 9 · 1:00 ET", line: "vs. Saints", net: "FOX" },
    last: [
      { res: "W", line: "vs. ATL 31-24" },
      { res: "L", line: "@ DET 17-31" },
      { res: "W", line: "@ NO 26-20" },
    ],
    stat: [["Mayfield", "2,089 yds · 14 TD"], ["Evans", "612 yds · 5 TD"], ["Defense", "Sacks 22"]],
    badge: "BYE WK 9",
  },
  {
    abbr: "MIN", name: "Minnesota Timberwolves", sport: "NBA", record: "WCSF · trail 1-2",
    cs: ["#0c2340", "#236192"],
    rank: "Down 2-1 vs. Denver",
    next: { when: "Today 8:30 ET", line: "@ Denver — Game 4", net: "TNT" },
    last: [
      { res: "L", line: "@ DEN 99-110", note: "G3 — Jokić 38" },
      { res: "W", line: "@ DEN 105-100", note: "G2 — Ant 36" },
      { res: "L", line: "@ DEN 90-101", note: "G1" },
    ],
    stat: [["Edwards", "30.4 / 7.1 / 6.0"], ["Gobert", "DPOY runner-up"], ["3PT D", "#1 in NBA"]],
    badge: "MUST WIN",
  },
];
