import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/preact";
import { QuickLinksWidget } from "../src/components/QuickLinksWidget";

afterEach(cleanup);

const sampleLinks = [
  { name: "Gmail", url: "https://mail.google.com", icon: "📧" },
  { name: "Calendar", url: "https://calendar.google.com", icon: "📅" },
];

const sampleSections = [
  {
    title: "Socials",
    icon: "👤",
    links: [
      { name: "Twitter/X", url: "https://x.com/home", icon: "𝕏" },
      { name: "Instagram", url: "https://www.instagram.com/", icon: "📷" },
    ],
  },
  {
    title: "Professional",
    icon: "📧",
    links: [
      { name: "LinkedIn", url: "https://www.linkedin.com" },
    ],
  },
];

describe("QuickLinksWidget with sections", () => {
  it("renders quick links and section headers", () => {
    render(<QuickLinksWidget links={sampleLinks} linkSections={sampleSections} />);
    expect(screen.getByText("Quick Links")).toBeTruthy();
    expect(screen.getByText("Gmail")).toBeTruthy();
    expect(screen.getByText("Calendar")).toBeTruthy();
    expect(screen.getByText("Socials")).toBeTruthy();
    expect(screen.getByText("Professional")).toBeTruthy();
    expect(screen.getByText("Twitter/X")).toBeTruthy();
    expect(screen.getByText("LinkedIn")).toBeTruthy();
  });

  it("renders without sections when linkSections is undefined", () => {
    render(<QuickLinksWidget links={sampleLinks} />);
    expect(screen.getByText("Quick Links")).toBeTruthy();
    expect(screen.getByText("Gmail")).toBeTruthy();
    expect(screen.queryByText("Socials")).toBeNull();
  });

  it("renders empty state when no links and no sections", () => {
    render(<QuickLinksWidget links={[]} linkSections={[]} />);
    expect(screen.getByText("No links configured")).toBeTruthy();
  });

  it("collapses and expands sections on click", () => {
    render(<QuickLinksWidget links={sampleLinks} linkSections={sampleSections} />);

    const socialsButton = screen.getByText("Socials").closest("button")!;
    expect(screen.getByText("Twitter/X")).toBeTruthy();

    fireEvent.click(socialsButton);
    expect(screen.queryByText("Twitter/X")).toBeNull();

    fireEvent.click(socialsButton);
    expect(screen.getByText("Twitter/X")).toBeTruthy();
  });

  it("section headers have aria-expanded attribute", () => {
    render(<QuickLinksWidget links={sampleLinks} linkSections={sampleSections} />);
    const socialsButton = screen.getByText("Socials").closest("button")!;
    expect(socialsButton.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(socialsButton);
    expect(socialsButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders sections with only linkSections (no quickLinks)", () => {
    render(<QuickLinksWidget links={[]} linkSections={sampleSections} />);
    expect(screen.getByText("Socials")).toBeTruthy();
    expect(screen.getByText("Twitter/X")).toBeTruthy();
  });
});
