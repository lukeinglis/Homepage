import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/preact";
import { WidgetWrapper } from "../src/components/WidgetWrapper";

afterEach(cleanup);

function WorkingWidgetA() {
  return <div data-testid="widget-a">Clock: 12:00</div>;
}

function WorkingWidgetB() {
  return <div data-testid="widget-b">Weather: Sunny</div>;
}

function WorkingWidgetC() {
  return <div data-testid="widget-c">Quote of the day</div>;
}

function BrokenWidget(): never {
  throw new Error("Simulated widget crash");
}

describe("Widget isolation", () => {
  it("renders all widgets when none throw", () => {
    render(
      <div>
        <WidgetWrapper name="a">
          <WorkingWidgetA />
        </WidgetWrapper>
        <WidgetWrapper name="b">
          <WorkingWidgetB />
        </WidgetWrapper>
        <WidgetWrapper name="c">
          <WorkingWidgetC />
        </WidgetWrapper>
      </div>,
    );
    expect(screen.getByTestId("widget-a")).toBeTruthy();
    expect(screen.getByTestId("widget-b")).toBeTruthy();
    expect(screen.getByTestId("widget-c")).toBeTruthy();
  });

  it("other widgets still render when one widget throws", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <div>
        <WidgetWrapper name="a">
          <WorkingWidgetA />
        </WidgetWrapper>
        <WidgetWrapper name="broken">
          <BrokenWidget />
        </WidgetWrapper>
        <WidgetWrapper name="c">
          <WorkingWidgetC />
        </WidgetWrapper>
      </div>,
    );
    expect(screen.getByTestId("widget-a")).toBeTruthy();
    expect(screen.getByTestId("widget-c")).toBeTruthy();
    expect(screen.getByText("Widget unavailable")).toBeTruthy();
    consoleSpy.mockRestore();
  });

  it("shows fallback only for the broken widget, not siblings", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <div>
        <WidgetWrapper name="a">
          <WorkingWidgetA />
        </WidgetWrapper>
        <WidgetWrapper name="broken">
          <BrokenWidget />
        </WidgetWrapper>
      </div>,
    );
    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(1);
    expect(screen.getByTestId("widget-a")).toBeTruthy();
    consoleSpy.mockRestore();
  });

  it("multiple broken widgets each show their own fallback independently", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <div>
        <WidgetWrapper name="broken-1">
          <BrokenWidget />
        </WidgetWrapper>
        <WidgetWrapper name="working">
          <WorkingWidgetB />
        </WidgetWrapper>
        <WidgetWrapper name="broken-2">
          <BrokenWidget />
        </WidgetWrapper>
      </div>,
    );
    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(2);
    expect(screen.getByTestId("widget-b")).toBeTruthy();
    consoleSpy.mockRestore();
  });

  it("page-level container does not crash from widget errors", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      render(
        <main>
          <header>Dashboard</header>
          <section>
            <WidgetWrapper name="broken">
              <BrokenWidget />
            </WidgetWrapper>
            <WidgetWrapper name="ok">
              <WorkingWidgetA />
            </WidgetWrapper>
          </section>
          <footer>Footer content</footer>
        </main>,
      );
    }).not.toThrow();
    expect(screen.getByText("Dashboard")).toBeTruthy();
    expect(screen.getByText("Footer content")).toBeTruthy();
    expect(screen.getByTestId("widget-a")).toBeTruthy();
    consoleSpy.mockRestore();
  });
});
