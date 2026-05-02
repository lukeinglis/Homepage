import type { DayConfig } from "../types";

const saturday: DayConfig = {
  name: "saturday",
  theme: {
    primary: "#9f1239",
    secondary: "#f43f5e",
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
    { name: "YouTube", url: "https://youtube.com", icon: "📺" },
    { name: "Reddit", url: "https://reddit.com", icon: "💭" },
    { name: "Music", url: "https://open.spotify.com", icon: "🎵" },
    { name: "Recipes", url: "https://www.allrecipes.com", icon: "🍳" },
  ],
  focusText: "Your day off. Explore, rest, or pursue a passion project.",
};

export default saturday;
