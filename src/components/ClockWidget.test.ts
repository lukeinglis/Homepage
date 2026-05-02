import { describe, it, expect } from "vitest";
import { formatTime, formatDate } from "./ClockWidget";

describe("formatTime", () => {
  it("formats morning time correctly", () => {
    const date = new Date(2026, 0, 5, 9, 5, 3);
    expect(formatTime(date)).toBe("9:05:03 AM");
  });

  it("formats noon as 12 PM", () => {
    const date = new Date(2026, 0, 5, 12, 0, 0);
    expect(formatTime(date)).toBe("12:00:00 PM");
  });

  it("formats midnight as 12 AM", () => {
    const date = new Date(2026, 0, 5, 0, 0, 0);
    expect(formatTime(date)).toBe("12:00:00 AM");
  });

  it("formats afternoon time correctly", () => {
    const date = new Date(2026, 0, 5, 14, 30, 45);
    expect(formatTime(date)).toBe("2:30:45 PM");
  });

  it("pads single-digit minutes and seconds", () => {
    const date = new Date(2026, 0, 5, 1, 2, 3);
    expect(formatTime(date)).toBe("1:02:03 AM");
  });
});

describe("formatDate", () => {
  it("formats a Monday date", () => {
    const date = new Date(2026, 0, 5);
    expect(formatDate(date)).toBe("Monday, January 5, 2026");
  });

  it("formats a Saturday date", () => {
    const date = new Date(2026, 0, 10);
    expect(formatDate(date)).toBe("Saturday, January 10, 2026");
  });

  it("formats a date in December", () => {
    const date = new Date(2026, 11, 25);
    expect(formatDate(date)).toBe("Friday, December 25, 2026");
  });
});
