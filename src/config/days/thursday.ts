import type { DayConfig } from "../types";

const thursday: DayConfig = {
  name: "thursday",
  theme: {
    primary: "#6b21a8",
    secondary: "#a855f7",
    accent: "#c084fc",
    background: "#faf5ff",
    surface: "#ffffff",
    text: "#1e293b",
  },
  greeting: {
    morning: "Thursday energy. Push through with purpose.",
    afternoon: "Afternoon drive. Finish what you started.",
    evening: "Almost there. Tomorrow wraps the week.",
  },
  widgets: [
    { id: "clock" },
    { id: "weather" },
    { id: "quickLinks" },
    { id: "quote" },
    { id: "notes" },
  ],
  quickLinks: [
    { name: "GitHub", url: "https://github.com", icon: "💻" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", icon: "🔍" },
    { name: "Figma", url: "https://figma.com", icon: "🎨" },
    { name: "Slack", url: "https://slack.com", icon: "💬" },
  ],
  focusText: "Energy day. Channel your momentum into creative solutions.",
};

export default thursday;
