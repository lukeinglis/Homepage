import type { DayConfig, DayName, TimeOfDay } from "./types";
import { defaultConfig } from "./defaults";
import monday from "./days/monday";
import tuesday from "./days/tuesday";
import wednesday from "./days/wednesday";
import thursday from "./days/thursday";
import friday from "./days/friday";
import saturday from "./days/saturday";
import sunday from "./days/sunday";

const dayConfigs: Record<DayName, DayConfig> = {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
};

const dayIndexToName: DayName[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function getDayName(date: Date = new Date()): DayName {
  return dayIndexToName[date.getDay()];
}

export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function getDayConfig(date: Date = new Date()): DayConfig {
  const name = getDayName(date);
  return dayConfigs[name] ?? defaultConfig;
}

export function getGreeting(date: Date = new Date()): string {
  const config = getDayConfig(date);
  const time = getTimeOfDay(date);
  return config.greeting[time];
}

export { dayConfigs };
