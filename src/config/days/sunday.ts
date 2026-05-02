import type { DayConfig } from "../types";

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
    { name: "Reading", url: "https://medium.com", icon: "📚" },
    { name: "News", url: "https://news.ycombinator.com", icon: "📰" },
    { name: "Music", url: "https://open.spotify.com", icon: "🎵" },
    { name: "Journal", url: "https://notion.so", icon: "✍️" },
  ],
  focusText: "Calm day. Reflect on the past week and prepare for the next.",
};

export default sunday;
