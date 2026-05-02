import type { DayConfig } from "../types";

const monday: DayConfig = {
  name: "monday",
  theme: {
    primary: "#1e40af",
    secondary: "#2563eb",
    accent: "#60a5fa",
    background: "#eff6ff",
    surface: "#ffffff",
    text: "#1e293b",
  },
  greeting: {
    morning: "Rise and focus. A fresh week begins.",
    afternoon: "Afternoon momentum. Keep building.",
    evening: "Wind down. Reflect on today's progress.",
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
    { name: "Tasks", url: "https://todoist.com", icon: "✅" },
    { name: "Docs", url: "https://docs.google.com", icon: "📝" },
  ],
  focusText: "Deep work day. Tackle your hardest task first.",
};

export default monday;
