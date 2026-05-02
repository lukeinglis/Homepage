import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/preact";
import { WidgetWrapper } from "./WidgetWrapper";

afterEach(cleanup);

function BrokenWidget(): never {
  throw new Error("Widget exploded");
}

function WorkingWidget() {
  return <p>Hello from widget</p>;
}

describe("WidgetWrapper", () => {
  it("renders children when no error occurs", () => {
    render(
      <WidgetWrapper name="test">
        <WorkingWidget />
      </WidgetWrapper>,
    );
    expect(screen.getByText("Hello from widget")).toBeTruthy();
  });

  it("shows fallback when child throws", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <WidgetWrapper name="broken">
        <BrokenWidget />
      </WidgetWrapper>,
    );
    expect(screen.getByText("Widget unavailable")).toBeTruthy();
    expect(screen.getByRole("alert")).toBeTruthy();
    consoleSpy.mockRestore();
  });

  it("logs error to console when child throws", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <WidgetWrapper name="broken">
        <BrokenWidget />
      </WidgetWrapper>,
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Widget "broken" failed to render:',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it("does not propagate errors to parent", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      render(
        <div>
          <WidgetWrapper name="broken">
            <BrokenWidget />
          </WidgetWrapper>
          <p>Parent is fine</p>
        </div>,
      );
    }).not.toThrow();
    expect(screen.getByText("Parent is fine")).toBeTruthy();
    consoleSpy.mockRestore();
  });
});
