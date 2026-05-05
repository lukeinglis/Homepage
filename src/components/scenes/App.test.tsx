import { describe, it, expect, vi, afterEach } from "vitest";
import { detectScene } from "./App";

afterEach(() => {
  vi.useRealTimers();
});

describe("detectScene", () => {
  it("returns 0 (weekday AM) for Tuesday 9am", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 5, 9, 0));
    expect(detectScene()).toBe(0);
  });

  it("returns 1 (weekday PM) for Tuesday 3pm", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 5, 15, 0));
    expect(detectScene()).toBe(1);
  });

  it("returns 2 (weekend AM) for Saturday 10am", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 3, 10, 0));
    expect(detectScene()).toBe(2);
  });

  it("returns 3 (weekend PM) for Sunday 7pm", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 3, 19, 0)); // May 3 2026 is Sunday
    expect(detectScene()).toBe(3);
  });

  it("boundary: 13:59 is AM, 14:00 is PM on weekday", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 5, 13, 59));
    expect(detectScene()).toBe(0);
    vi.setSystemTime(new Date(2026, 4, 5, 14, 0));
    expect(detectScene()).toBe(1);
  });

  it("boundary: midnight Saturday is weekend AM", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 3, 0, 0));
    expect(detectScene()).toBe(2);
  });
});
