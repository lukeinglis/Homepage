export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  fontFamily?: string;
}

export interface Greeting {
  morning: string;
  afternoon: string;
  evening: string;
}

export interface QuickLink {
  name: string;
  url: string;
  icon?: string;
}

export interface LinkSection {
  title: string;
  icon?: string;
  links: QuickLink[];
}

export interface WidgetSlot {
  id: string;
  props?: Record<string, unknown>;
}

export interface DayConfig {
  name: string;
  theme: Theme;
  greeting: Greeting;
  widgets: WidgetSlot[];
  quickLinks: QuickLink[];
  linkSections?: LinkSection[];
  focusText: string;
}

export interface CalendarSource {
  name: string;
  url: string;
  color?: string;
}

export interface CalendarConfig {
  sources: CalendarSource[];
  cacheTtlMinutes: number;
}

export type DayName =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type TimeOfDay = "morning" | "afternoon" | "evening";
