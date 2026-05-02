import type { DayConfig } from "../types";
import { socialsSection, professionalSection } from "../shared-links";

const thursday: DayConfig = {
  name: "thursday",
  theme: {
    primary: "#6b21a8",
    secondary: "#7c3aed",
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
    { name: "Gmail", url: "https://mail.google.com", icon: "📧" },
    { name: "Calendar", url: "https://calendar.google.com", icon: "📅" },
    { name: "LinkedIn", url: "https://www.linkedin.com", icon: "💼" },
    { name: "DraftKings", url: "https://sportsbook.draftkings.com", icon: "🎲" },
  ],
  linkSections: [socialsSection, professionalSection],
  focusText: "Energy day. Channel your momentum into creative solutions.",
};

export default thursday;
