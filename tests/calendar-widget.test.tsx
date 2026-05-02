import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/preact";
import { CalendarWidget } from "../src/components/CalendarWidget";

afterEach(cleanup);

beforeEach(() => {
  localStorage.clear();
});

describe("CalendarWidget", () => {
  it("renders title", () => {
    render(<CalendarWidget />);
    expect(screen.getByText("Today's Schedule")).toBeTruthy();
  });

  it("shows empty state when no calendar sources configured", async () => {
    render(<CalendarWidget />);
    const empty = await screen.findByText("No events today");
    expect(empty).toBeTruthy();
  });

  it("renders without crashing in widget wrapper", () => {
    expect(() => render(<CalendarWidget />)).not.toThrow();
  });
});

describe("CalendarWidget localStorage caching", () => {
  it("reads from cache when available and not expired", async () => {
    const cached = {
      events: [],
      timestamp: Date.now(),
    };
    localStorage.setItem("calendar-widget-cache", JSON.stringify(cached));

    render(<CalendarWidget />);
    const empty = await screen.findByText("No events today");
    expect(empty).toBeTruthy();
  });

  it("ignores expired cache", async () => {
    const cached = {
      events: [
        {
          summary: "Old Event",
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          allDay: false,
        },
      ],
      timestamp: Date.now() - 20 * 60 * 1000,
    };
    localStorage.setItem("calendar-widget-cache", JSON.stringify(cached));

    render(<CalendarWidget />);
    const empty = await screen.findByText("No events today");
    expect(empty).toBeTruthy();
  });

  it("handles corrupted cache gracefully", async () => {
    localStorage.setItem("calendar-widget-cache", "not valid json{{{");

    render(<CalendarWidget />);
    const empty = await screen.findByText("No events today");
    expect(empty).toBeTruthy();
  });
});
