import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/preact";
import { WeatherWidget } from "./WeatherWidget";

vi.mock("../lib/geolocation", () => ({
  getLocation: vi.fn(),
}));

vi.mock("../lib/weather", () => ({
  fetchWeather: vi.fn(),
}));

import { getLocation } from "../lib/geolocation";
import { fetchWeather } from "../lib/weather";

const mockGetLocation = vi.mocked(getLocation);
const mockFetchWeather = vi.mocked(fetchWeather);

describe("WeatherWidget", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading state initially", () => {
    mockGetLocation.mockReturnValue(new Promise(() => {}));
    const { container } = render(<WeatherWidget />);
    const widget = container.querySelector(".weather-loading");
    expect(widget).toBeTruthy();
    expect(widget?.getAttribute("aria-busy")).toBe("true");
  });

  it("renders weather data after loading", async () => {
    mockGetLocation.mockResolvedValue({ lat: 51.51, lon: -0.13 });
    mockFetchWeather.mockResolvedValue({
      temperature: 18.5,
      windSpeed: 12.3,
      condition: { description: "Partly cloudy", icon: "⛅" },
      weatherCode: 2,
    });

    const { container } = render(<WeatherWidget />);

    await waitFor(() => {
      expect(container.querySelector(".weather-temp")).toBeTruthy();
    });

    expect(container.querySelector(".weather-temp")?.textContent).toContain(
      "19",
    );
    expect(
      container.querySelector(".weather-condition")?.textContent,
    ).toContain("Partly cloudy");
    expect(container.querySelector(".weather-icon")?.textContent).toContain(
      "⛅",
    );
    expect(container.querySelector(".weather-wind")?.textContent).toContain(
      "12.3",
    );
  });

  it("shows error state when fetch fails", async () => {
    mockGetLocation.mockResolvedValue({ lat: 51.51, lon: -0.13 });
    mockFetchWeather.mockRejectedValue(new Error("Network error"));

    const { container } = render(<WeatherWidget />);

    await waitFor(() => {
      expect(container.querySelector(".weather-error")).toBeTruthy();
    });

    expect(container.querySelector(".weather-error")?.textContent).toContain(
      "Weather unavailable",
    );
  });

  it("shows error state when geolocation fails", async () => {
    mockGetLocation.mockRejectedValue(new Error("Geolocation failed"));

    const { container } = render(<WeatherWidget />);

    await waitFor(() => {
      expect(container.querySelector(".weather-error")).toBeTruthy();
    });
  });
});
