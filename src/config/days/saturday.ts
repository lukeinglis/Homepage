import type { DayConfig } from "../types";
import {
  socialsSection,
  sportsNewsSection,
  sportsBettingSection,
  fantasySportsSection,
} from "../shared-links";

const saturday: DayConfig = {
  name: "saturday",
  theme: {
    primary: "#9f1239",
    secondary: "#be123c",
    accent: "#fb7185",
    background: "#fff1f2",
    surface: "#ffffff",
    text: "#1e293b",
  },
  greeting: {
    morning: "Saturday morning. The day is yours.",
    afternoon: "Lazy afternoon. Enjoy the moment.",
    evening: "Saturday evening. Relax and unwind.",
  },
  widgets: [
    { id: "clock" },
    { id: "weather" },
    { id: "quickLinks" },
    { id: "quote" },
    { id: "notes" },
  ],
  quickLinks: [
    { name: "DraftKings", url: "https://sportsbook.draftkings.com", icon: "🎲" },
    { name: "ESPN Fantasy", url: "https://fantasy.espn.com/baseball/league?leagueId=4739&seasonId=2025", icon: "⚾" },
    { name: "Action Network", url: "https://www.actionnetwork.com", icon: "📊" },
    { name: "Reddit", url: "https://www.reddit.com/", icon: "🤖" },
  ],
  linkSections: [
    socialsSection,
    sportsNewsSection,
    sportsBettingSection,
    fantasySportsSection,
  ],
  focusText: "Your day off. Explore, rest, or pursue a passion project.",
};

export default saturday;
