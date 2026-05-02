import type { DayConfig } from "../types";
import { socialsSection, professionalSection } from "../shared-links";

const wednesday: DayConfig = {
  name: "wednesday",
  theme: {
    primary: "#115e59",
    secondary: "#0f766e",
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
    { name: "Gmail", url: "https://mail.google.com", icon: "📧" },
    { name: "Calendar", url: "https://calendar.google.com", icon: "📅" },
    { name: "LinkedIn", url: "https://www.linkedin.com", icon: "💼" },
    { name: "DraftKings", url: "https://sportsbook.draftkings.com", icon: "🎲" },
  ],
  linkSections: [socialsSection, professionalSection],
  focusText: "Balance day. Review progress and adjust course.",
};

export default wednesday;
