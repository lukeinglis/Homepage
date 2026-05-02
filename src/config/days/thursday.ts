import type { DayConfig } from "../types";

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
  focusText: "Energy day. Channel your momentum into creative solutions.",
};

export default thursday;
