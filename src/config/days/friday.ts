import type { DayConfig } from "../types";

const friday: DayConfig = {
  name: "friday",
  theme: {
    primary: "#92400e",
    secondary: "#f59e0b",
    accent: "#fbbf24",
    background: "#fffbeb",
    surface: "#ffffff",
    text: "#1e293b",
  },
  greeting: {
    morning: "Friday at last. Wrap up and celebrate wins.",
    afternoon: "Coasting into the weekend. Tie up loose ends.",
    evening: "Week complete. You earned this rest.",
  },
  widgets: [
    { id: "clock" },
    { id: "weather" },
    { id: "quickLinks" },
    { id: "quote" },
    { id: "notes" },
  ],
  quickLinks: [
    { name: "Email", url: "https://mail.google.com", icon: "📧" },
    { name: "Calendar", url: "https://calendar.google.com", icon: "📅" },
    { name: "Music", url: "https://open.spotify.com", icon: "🎵" },
    { name: "News", url: "https://news.ycombinator.com", icon: "📰" },
  ],
  focusText: "Wind-down day. Close open loops and plan for next week.",
};

export default friday;
