import { describe, it, expect } from "vitest";
import { quotes, getQuoteOfDay } from "./quotes";

describe("quotes data", () => {
  it("contains at least 50 quotes", () => {
    expect(quotes.length).toBeGreaterThanOrEqual(50);
  });

  it("every quote has non-empty text", () => {
    for (const q of quotes) {
      expect(q.text.trim().length).toBeGreaterThan(0);
    }
  });

  it("every quote has non-empty author", () => {
    for (const q of quotes) {
      expect(q.author.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("getQuoteOfDay", () => {
  it("returns a quote object with text and author", () => {
    const quote = getQuoteOfDay();
    expect(quote).toHaveProperty("text");
    expect(quote).toHaveProperty("author");
    expect(quote.text.length).toBeGreaterThan(0);
    expect(quote.author.length).toBeGreaterThan(0);
  });

  it("returns the same quote for the same date", () => {
    const date = new Date(2026, 5, 15);
    const a = getQuoteOfDay(date);
    const b = getQuoteOfDay(date);
    expect(a).toEqual(b);
  });

  it("returns different quotes for different dates", () => {
    const a = getQuoteOfDay(new Date(2026, 0, 1));
    const b = getQuoteOfDay(new Date(2026, 0, 2));
    expect(a).not.toEqual(b);
  });

  it("returns consistent results across calls with same day", () => {
    const date = new Date(2026, 11, 25);
    const results = Array.from({ length: 10 }, () => getQuoteOfDay(date));
    const first = results[0];
    for (const r of results) {
      expect(r).toEqual(first);
    }
  });
});
