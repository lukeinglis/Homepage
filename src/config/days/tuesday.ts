import type { DayConfig } from "../types";

const tuesday: DayConfig = {
  name: "tuesday",
  theme: {
    primary: "#166534",
    secondary: "#15803d",
    accent: "#4ade80",
    background: "#f0fdf4",
    surface: "#ffffff",
    text: "#1e293b",
  },
  greeting: {
    morning: "Good morning. Time to make things happen.",
    afternoon: "Productive afternoon ahead.",
    evening: "Great work today. Time to recharge.",
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
    { name: "Slack", url: "https://slack.com", icon: "💬" },
    { name: "Jira", url: "https://jira.atlassian.com", icon: "📋" },
    { name: "Docs", url: "https://docs.google.com", icon: "📝" },
  ],
  focusText: "Collaboration day. Sync with your team and move projects forward.",
};

export default tuesday;
