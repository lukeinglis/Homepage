import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/preact";
import { QuickLinksWidget } from "./QuickLinksWidget";

afterEach(cleanup);

describe("QuickLinksWidget", () => {
  const testLinks = [
    { name: "Email", url: "https://mail.google.com", icon: "📧" },
    { name: "Calendar", url: "https://calendar.google.com", icon: "📅" },
    { name: "Tasks", url: "https://todoist.com" },
  ];

  it("renders all links", () => {
    render(<QuickLinksWidget links={testLinks} />);
    for (const link of testLinks) {
      expect(screen.getByLabelText(link.name)).toBeTruthy();
    }
  });

  it("sets correct href on each link", () => {
    render(<QuickLinksWidget links={testLinks} />);
    for (const link of testLinks) {
      const el = screen.getByLabelText(link.name) as HTMLAnchorElement;
      expect(el.getAttribute("href")).toBe(link.url);
    }
  });

  it("opens links in new tab", () => {
    render(<QuickLinksWidget links={testLinks} />);
    const el = screen.getByLabelText("Email") as HTMLAnchorElement;
    expect(el.getAttribute("target")).toBe("_blank");
    expect(el.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders icons when provided", () => {
    render(<QuickLinksWidget links={testLinks} />);
    expect(screen.getByText("📧")).toBeTruthy();
    expect(screen.getByText("📅")).toBeTruthy();
  });

  it("renders link names", () => {
    render(<QuickLinksWidget links={testLinks} />);
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Calendar")).toBeTruthy();
    expect(screen.getByText("Tasks")).toBeTruthy();
  });

  it("renders empty state for no links", () => {
    render(<QuickLinksWidget links={[]} />);
    expect(screen.getByText("No links configured")).toBeTruthy();
  });

  it("has accessible navigation landmark", () => {
    render(<QuickLinksWidget links={testLinks} />);
    expect(screen.getByRole("navigation")).toBeTruthy();
  });
});
