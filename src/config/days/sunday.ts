import type { DayConfig } from "../types";

const sunday: DayConfig = {
  name: "sunday",
  theme: {
    primary: "#4338ca",
    secondary: "#4f46e5",
    accent: "#a5b4fc",
    background: "#eef2ff",
    surface: "#ffffff",
    text: "#1e293b",
  },
  greeting: {
    morning: "Calm Sunday morning. Ease into the day.",
    afternoon: "Peaceful afternoon. Reflect and recharge.",
    evening: "Sunday evening. Set intentions for the week ahead.",
  },
  widgets: [
    { id: "clock" },
    { id: "weather" },
    { id: "quickLinks" },
    { id: "quote" },
    { id: "notes" },
  ],
  quickLinks: [
    { name: "DraftKings", url: "https://sportsbook.draftkings.com", icon: "🎲" },
    { name: "ESPN Fantasy", url: "https://fantasy.espn.com/baseball/league?leagueId=4739&seasonId=2025", icon: "⚾" },
    { name: "Action Network", url: "https://www.actionnetwork.com", icon: "📊" },
    { name: "Reddit", url: "https://www.reddit.com/", icon: "🤖" },
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
    {
      title: "Sports Blogs & News",
      icon: "📰",
      links: [
        { name: "Auburn Sports", url: "https://www.on3.com/teams/auburn-tigers/", icon: "🐯" },
        { name: "Auburn Message Board", url: "https://www.on3.com/boards/forums/the-corner.22/", icon: "💬" },
        { name: "Chelsea FC", url: "https://www.chelseafc.com/en", icon: "⚽" },
      ],
    },
    {
      title: "Sports Betting",
      icon: "📊",
      links: [
        { name: "DraftKings", url: "https://sportsbook.draftkings.com", icon: "🎲" },
        { name: "Action Network", url: "https://www.actionnetwork.com", icon: "📊" },
        { name: "KenPom", url: "https://kenpom.com", icon: "📈" },
        { name: "Establish The Run", url: "https://establishtherun.com", icon: "🏈" },
        { name: "Fantasy Labs", url: "https://www.fantasylabs.com", icon: "🔬" },
      ],
    },
    {
      title: "Fantasy Sports",
      icon: "🏆",
      links: [
        { name: "ESPN Fantasy Baseball", url: "https://fantasy.espn.com/baseball/league?leagueId=4739&seasonId=2025", icon: "⚾" },
        { name: "Yahoo FF League 1", url: "https://football.fantasysports.yahoo.com/f1/655705/1", icon: "🏈" },
        { name: "Yahoo FF League 2", url: "https://football.fantasysports.yahoo.com/f1/252107", icon: "🏈" },
        { name: "Yahoo FF League 3", url: "https://football.fantasysports.yahoo.com", icon: "🏈" },
        { name: "Sleeper Fantasy", url: "https://sleeper.com", icon: "🌙" },
      ],
    },
  ],
  focusText: "Calm day. Reflect on the past week and prepare for the next.",
};

export default sunday;
