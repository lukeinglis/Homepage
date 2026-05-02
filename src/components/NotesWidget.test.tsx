import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/preact";
import { NotesWidget, getStorageUsage } from "./NotesWidget";

describe("NotesWidget", () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    vi.useFakeTimers();
    storage = {};
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(
      (key: string) => storage[key] ?? null,
    );
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(
      (key: string, value: string) => {
        storage[key] = value;
      },
    );
    vi.spyOn(Storage.prototype, "key").mockImplementation((index: number) => {
      const keys = Object.keys(storage);
      return keys[index] ?? null;
    });
    Object.defineProperty(Storage.prototype, "length", {
      get: () => Object.keys(storage).length,
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders a textarea with placeholder", () => {
    const { container } = render(<NotesWidget />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toBeTruthy();
    expect(textarea?.getAttribute("placeholder")).toBe(
      "Jot down your thoughts...",
    );
  });

  it("loads saved content from localStorage on mount", () => {
    storage["homepage-notes"] = "Previously saved content";
    const { container } = render(<NotesWidget />);
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea.value).toBe("Previously saved content");
  });

  it("displays character count", () => {
    storage["homepage-notes"] = "Hello";
    const { container } = render(<NotesWidget />);
    const count = container.querySelector(".notes-count");
    expect(count?.textContent).toContain("5 characters");
  });

  it("persists content to localStorage after debounce", () => {
    const { container } = render(<NotesWidget />);
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;

    fireEvent.input(textarea, { target: { value: "New note" } });

    expect(storage["homepage-notes"]).toBeUndefined();

    vi.advanceTimersByTime(500);

    expect(storage["homepage-notes"]).toBe("New note");
  });

  it("debounces rapid input", () => {
    const { container } = render(<NotesWidget />);
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;

    fireEvent.input(textarea, { target: { value: "a" } });
    vi.advanceTimersByTime(200);
    fireEvent.input(textarea, { target: { value: "ab" } });
    vi.advanceTimersByTime(200);
    fireEvent.input(textarea, { target: { value: "abc" } });

    expect(storage["homepage-notes"]).toBeUndefined();

    vi.advanceTimersByTime(500);

    expect(storage["homepage-notes"]).toBe("abc");
  });

  it("survives a localStorage quota error without crashing", () => {
    (Storage.prototype.setItem as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        throw new DOMException("QuotaExceededError");
      },
    );

    const { container } = render(<NotesWidget />);
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;

    fireEvent.input(textarea, { target: { value: "should not crash" } });
    vi.advanceTimersByTime(500);

    expect(textarea).toBeTruthy();
    expect(container.querySelector(".notes-widget")).toBeTruthy();
  });

  it("updates character count on input", () => {
    const { container } = render(<NotesWidget />);
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;

    fireEvent.input(textarea, { target: { value: "Hello world" } });

    const count = container.querySelector(".notes-count");
    expect(count?.textContent).toContain("11 characters");
  });
});

describe("getStorageUsage", () => {
  it("calculates bytes used across all localStorage entries", () => {
    const items: Record<string, string> = { testkey: "testvalue" };
    const keys = Object.keys(items);
    const fakeStorage = {
      length: keys.length,
      key: (i: number) => keys[i] ?? null,
      getItem: (k: string) => items[k] ?? null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    } as Storage;
    const usage = getStorageUsage(fakeStorage);
    expect(usage).toBe(("testkey".length + "testvalue".length) * 2);
  });
});
