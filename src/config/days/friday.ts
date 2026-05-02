import type { DayConfig } from "../types";

const friday: DayConfig = {
  name: "friday",
  theme: {
    primary: "#92400e",
    secondary: "#b45309",
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
  focusText: "Wind-down day. Close open loops and plan for next week.",
};

export default friday;
