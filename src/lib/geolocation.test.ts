import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLocation } from "./geolocation";

function mockStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      for (const key of Object.keys(store)) delete store[key];
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
}

describe("getLocation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    const ls = mockStorage();
    const ss = mockStorage();
    vi.stubGlobal("localStorage", ls);
    vi.stubGlobal("sessionStorage", ss);
  });

  it("returns cached coordinates from localStorage", async () => {
    localStorage.setItem(
      "homepage-location",
      JSON.stringify({ lat: 40.71, lon: -74.01 }),
    );

    const result = await getLocation();
    expect(result.lat).toBe(40.71);
    expect(result.lon).toBe(-74.01);
  });

  it("uses browser geolocation and caches result", async () => {
    const mockGeo = {
      getCurrentPosition: vi.fn(
        (
          success: PositionCallback,
          _error?: PositionErrorCallback | null, // eslint-disable-line @typescript-eslint/no-unused-vars
          _options?: PositionOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
        ) => {
          success({
            coords: { latitude: 48.85, longitude: 2.35 },
          } as GeolocationPosition);
        },
      ),
    };
    vi.stubGlobal("navigator", { geolocation: mockGeo });

    const result = await getLocation();
    expect(result.lat).toBe(48.85);
    expect(result.lon).toBe(2.35);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "homepage-location",
      JSON.stringify({ lat: 48.85, lon: 2.35 }),
    );
  });

  it("falls back to defaults when geolocation is denied", async () => {
    const mockGeo = {
      getCurrentPosition: vi.fn(
        (
          _success: PositionCallback,
          error?: PositionErrorCallback | null,
        ) => {
          if (error) {
            error({
              code: 1,
              message: "User denied",
              PERMISSION_DENIED: 1,
              POSITION_UNAVAILABLE: 2,
              TIMEOUT: 3,
            });
          }
        },
      ),
    };
    vi.stubGlobal("navigator", { geolocation: mockGeo });

    const result = await getLocation();
    expect(result.lat).toBe(51.51);
    expect(result.lon).toBe(-0.13);
  });

  it("marks denied in sessionStorage so it does not prompt again", async () => {
    const mockGeo = {
      getCurrentPosition: vi.fn(
        (
          _success: PositionCallback,
          error?: PositionErrorCallback | null,
        ) => {
          if (error) {
            error({
              code: 1,
              message: "User denied",
              PERMISSION_DENIED: 1,
              POSITION_UNAVAILABLE: 2,
              TIMEOUT: 3,
            });
          }
        },
      ),
    };
    vi.stubGlobal("navigator", { geolocation: mockGeo });

    await getLocation();
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      "homepage-location-denied",
      "true",
    );

    // Second call should not prompt again
    sessionStorage.getItem = vi.fn(() => "true");
    const result = await getLocation();
    expect(result.lat).toBe(51.51);
    expect(mockGeo.getCurrentPosition).toHaveBeenCalledTimes(1);
  });

  it("falls back to defaults when navigator is undefined", async () => {
    vi.stubGlobal("navigator", undefined);

    const result = await getLocation();
    expect(result.lat).toBe(51.51);
    expect(result.lon).toBe(-0.13);
  });

  it("ignores corrupted localStorage data", async () => {
    localStorage.setItem("homepage-location", "not-json");

    const mockGeo = {
      getCurrentPosition: vi.fn(
        (
          success: PositionCallback,
        ) => {
          success({
            coords: { latitude: 35.68, longitude: 139.69 },
          } as GeolocationPosition);
        },
      ),
    };
    vi.stubGlobal("navigator", { geolocation: mockGeo });

    const result = await getLocation();
    expect(result.lat).toBe(35.68);
    expect(result.lon).toBe(139.69);
  });
});
