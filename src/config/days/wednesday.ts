import type { DayConfig } from "../types";

const wednesday: DayConfig = {
  name: "wednesday",
  theme: {
    primary: "#115e59",
    secondary: "#14b8a6",
    accent: "#5eead4",
    background: "#f0fdfa",
    surface: "#ffffff",
    text: "#1e293b",
  },
  greeting: {
    morning: "Midweek balance. Steady and purposeful.",
    afternoon: "Halfway there. Keep the rhythm.",
    evening: "Rest well. The week's second half awaits.",
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
    { name: "Notes", url: "https://notion.so", icon: "📓" },
    { name: "Drive", url: "https://drive.google.com", icon: "📁" },
  ],
  focusText: "Balance day. Review progress and adjust course.",
};

export default wednesday;
