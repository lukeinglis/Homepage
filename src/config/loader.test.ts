import { describe, it, expect } from "vitest";
import {
  getDayName,
  getTimeOfDay,
  getDayConfig,
  getGreeting,
  dayConfigs,
} from "./loader";
import type { DayName } from "./types";

describe("getDayName", () => {
  const cases: [number, DayName][] = [
    [0, "sunday"],
    [1, "monday"],
    [2, "tuesday"],
    [3, "wednesday"],
    [4, "thursday"],
    [5, "friday"],
    [6, "saturday"],
  ];

  it.each(cases)("returns %s for day index %i", (dayIndex, expected) => {
    const date = new Date(2026, 0, 4 + dayIndex); // 2026-01-04 is a Sunday
    expect(getDayName(date)).toBe(expected);
  });
});

describe("getTimeOfDay", () => {
  it("returns morning before noon", () => {
    const date = new Date(2026, 0, 5, 8, 0);
    expect(getTimeOfDay(date)).toBe("morning");
  });

  it("returns morning at midnight", () => {
    const date = new Date(2026, 0, 5, 0, 0);
    expect(getTimeOfDay(date)).toBe("morning");
  });

  it("returns afternoon at noon", () => {
    const date = new Date(2026, 0, 5, 12, 0);
    expect(getTimeOfDay(date)).toBe("afternoon");
  });

  it("returns afternoon at 5pm", () => {
    const date = new Date(2026, 0, 5, 17, 59);
    expect(getTimeOfDay(date)).toBe("afternoon");
  });

  it("returns evening at 6pm", () => {
    const date = new Date(2026, 0, 5, 18, 0);
    expect(getTimeOfDay(date)).toBe("evening");
  });

  it("returns evening at 11pm", () => {
    const date = new Date(2026, 0, 5, 23, 0);
    expect(getTimeOfDay(date)).toBe("evening");
  });
});

describe("getDayConfig", () => {
  it("returns monday config for a Monday", () => {
    const date = new Date(2026, 0, 5); // Monday
    const config = getDayConfig(date);
    expect(config.name).toBe("monday");
    expect(config.theme.primary).toBe("#1e40af");
  });

  it("returns saturday config for a Saturday", () => {
    const date = new Date(2026, 0, 10); // Saturday
    const config = getDayConfig(date);
    expect(config.name).toBe("saturday");
    expect(config.theme.primary).toBe("#9f1239");
  });

  it("returns sunday config for a Sunday", () => {
    const date = new Date(2026, 0, 4); // Sunday
    const config = getDayConfig(date);
    expect(config.name).toBe("sunday");
  });
});

describe("getGreeting", () => {
  it("returns morning greeting for morning time", () => {
    const date = new Date(2026, 0, 5, 8, 0); // Monday morning
    const greeting = getGreeting(date);
    expect(greeting).toBe("Rise and focus. A fresh week begins.");
  });

  it("returns afternoon greeting for afternoon time", () => {
    const date = new Date(2026, 0, 5, 14, 0); // Monday afternoon
    const greeting = getGreeting(date);
    expect(greeting).toBe("Afternoon momentum. Keep building.");
  });

  it("returns evening greeting for evening time", () => {
    const date = new Date(2026, 0, 5, 20, 0); // Monday evening
    const greeting = getGreeting(date);
    expect(greeting).toBe("Wind down. Reflect on today's progress.");
  });
});

describe("day config validation", () => {
  const allDays: DayName[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  it("has configs for all 7 days", () => {
    for (const day of allDays) {
      expect(dayConfigs[day]).toBeDefined();
      expect(dayConfigs[day].name).toBe(day);
    }
  });

  it.each(allDays)("%s has all required theme colors", (day) => {
    const theme = dayConfigs[day].theme;
    expect(theme.primary).toMatch(/^#[0-9a-f]{6}$/i);
    expect(theme.secondary).toMatch(/^#[0-9a-f]{6}$/i);
    expect(theme.accent).toMatch(/^#[0-9a-f]{6}$/i);
    expect(theme.background).toMatch(/^#[0-9a-f]{6}$/i);
    expect(theme.surface).toMatch(/^#[0-9a-f]{6}$/i);
    expect(theme.text).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it.each(allDays)("%s has all three greeting time periods", (day) => {
    const greeting = dayConfigs[day].greeting;
    expect(greeting.morning).toBeTruthy();
    expect(greeting.afternoon).toBeTruthy();
    expect(greeting.evening).toBeTruthy();
  });

  it.each(allDays)("%s has widgets configured", (day) => {
    expect(dayConfigs[day].widgets.length).toBeGreaterThan(0);
    for (const widget of dayConfigs[day].widgets) {
      expect(widget.id).toBeTruthy();
    }
  });

  it.each(allDays)("%s has quick links", (day) => {
    expect(dayConfigs[day].quickLinks.length).toBeGreaterThan(0);
    for (const link of dayConfigs[day].quickLinks) {
      expect(link.name).toBeTruthy();
      expect(link.url).toBeTruthy();
    }
  });

  it.each(allDays)("%s has focus text", (day) => {
    expect(dayConfigs[day].focusText).toBeTruthy();
  });

  it("all days have distinct primary theme colors", () => {
    const primaries = allDays.map((day) => dayConfigs[day].theme.primary);
    const unique = new Set(primaries);
    expect(unique.size).toBe(7);
  });
});
