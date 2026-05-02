import type { DayConfig } from "../types";
import {
  socialsSection,
  professionalSection,
  sportsNewsSection,
  sportsBettingSection,
  fantasySportsSection,
} from "../shared-links";

const sunday: DayConfig = {
  name: "sunday",
  theme: {
    primary: "#4338ca",
    secondary: "#4f46e5",
    accent: "#a5b4fc",
    background: "#eef2ff",
    surface: "#ffffff",
    text: "#1e293b",
  },
  greeting: {
    morning: "Calm Sunday morning. Ease into the day.",
    afternoon: "Peaceful afternoon. Reflect and recharge.",
    evening: "Sunday evening. Set intentions for the week ahead.",
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
    professionalSection,
    sportsNewsSection,
    sportsBettingSection,
    fantasySportsSection,
  ],
  focusText: "Calm day. Reflect on the past week and prepare for the next.",
};

export default sunday;
