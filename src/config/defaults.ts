import type { DayConfig, Theme, Greeting, WidgetSlot } from "./types";

export const defaultTheme: Theme = {
  primary: "#334155",
  secondary: "#64748b",
  accent: "#94a3b8",
  background: "#f8fafc",
  surface: "#ffffff",
  text: "#1e293b",
};

export const defaultGreeting: Greeting = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
};

export const defaultWidgets: WidgetSlot[] = [
  { id: "clock" },
  { id: "weather" },
  { id: "quickLinks" },
  { id: "quote" },
  { id: "notes" },
];

export const defaultLocation = {
  latitude: 51.51,
  longitude: -0.13,
  name: "London",
};

export const defaultConfig: DayConfig = {
  name: "default",
  theme: defaultTheme,
  greeting: defaultGreeting,
  widgets: defaultWidgets,
  quickLinks: [],
  focusText: "Stay focused and productive.",
};
