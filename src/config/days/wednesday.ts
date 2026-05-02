import type { DayConfig } from "../types";

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
  linkSections: [
    {
      title: "Socials",
      icon: "👤",
      links: [
        { name: "Twitter/X", url: "https://x.com/home", icon: "𝕏" },
        { name: "Instagram", url: "https://www.instagram.com/", icon: "📷" },
        { name: "Reddit", url: "https://www.reddit.com/", icon: "🤖" },
        { name: "YouTube", url: "https://www.youtube.com/", icon: "📺" },
      ],
    },
    {
      title: "Email & Professional",
      icon: "📧",
      links: [
        { name: "Gmail", url: "https://mail.google.com" },
        { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
        { name: "LinkedIn", url: "https://www.linkedin.com" },
      ],
    },
  ],
  focusText: "Balance day. Review progress and adjust course.",
};

export default wednesday;
