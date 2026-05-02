import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/preact";
import { QuoteWidget } from "./QuoteWidget";

vi.mock("../data/quotes", () => ({
  getQuoteOfDay: vi.fn(() => ({
    text: "Test quote text",
    author: "Test Author",
  })),
}));

describe("QuoteWidget", () => {
  it("renders quote text", () => {
    const { container } = render(<QuoteWidget />);
    expect(container.querySelector(".quote-text")?.textContent).toBe(
      "Test quote text",
    );
  });

  it("renders author attribution", () => {
    const { container } = render(<QuoteWidget />);
    expect(container.querySelector(".quote-author")?.textContent).toBe(
      "Test Author",
    );
  });

  it("uses blockquote for quote text", () => {
    const { container } = render(<QuoteWidget />);
    const blockquote = container.querySelector("blockquote.quote-text");
    expect(blockquote).toBeTruthy();
  });

  it("uses cite for author", () => {
    const { container } = render(<QuoteWidget />);
    const cite = container.querySelector("cite.quote-author");
    expect(cite).toBeTruthy();
  });
});
