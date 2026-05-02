import { describe, it, expect, vi, beforeEach } from "vitest";
import { mapWeatherCode, parseWeatherResponse, fetchWeather } from "./weather";

describe("mapWeatherCode", () => {
  it("maps code 0 to clear sky", () => {
    const result = mapWeatherCode(0);
    expect(result.description).toBe("Clear sky");
    expect(result.icon).toBe("☀️");
  });

  it("maps code 3 to overcast", () => {
    const result = mapWeatherCode(3);
    expect(result.description).toBe("Overcast");
    expect(result.icon).toBe("☁️");
  });

  it("maps code 61 to slight rain", () => {
    const result = mapWeatherCode(61);
    expect(result.description).toBe("Slight rain");
    expect(result.icon).toBe("🌧️");
  });

  it("maps code 71 to slight snow", () => {
    const result = mapWeatherCode(71);
    expect(result.description).toBe("Slight snow");
    expect(result.icon).toBe("🌨️");
  });

  it("maps code 95 to thunderstorm", () => {
    const result = mapWeatherCode(95);
    expect(result.description).toBe("Thunderstorm");
    expect(result.icon).toBe("⛈️");
  });

  it("maps unknown code to unknown condition", () => {
    const result = mapWeatherCode(999);
    expect(result.description).toBe("Unknown");
    expect(result.icon).toBe("❓");
  });
});

describe("parseWeatherResponse", () => {
  it("parses a valid Open-Meteo response", () => {
    const response = {
      current_weather: {
        temperature: 18.5,
        windspeed: 12.3,
        weathercode: 2,
      },
    };
    const result = parseWeatherResponse(response);
    expect(result.temperature).toBe(18.5);
    expect(result.windSpeed).toBe(12.3);
    expect(result.condition.description).toBe("Partly cloudy");
    expect(result.weatherCode).toBe(2);
  });

  it("handles zero values", () => {
    const response = {
      current_weather: {
        temperature: 0,
        windspeed: 0,
        weathercode: 0,
      },
    };
    const result = parseWeatherResponse(response);
    expect(result.temperature).toBe(0);
    expect(result.windSpeed).toBe(0);
    expect(result.condition.description).toBe("Clear sky");
  });

  it("handles negative temperature", () => {
    const response = {
      current_weather: {
        temperature: -5.2,
        windspeed: 20,
        weathercode: 75,
      },
    };
    const result = parseWeatherResponse(response);
    expect(result.temperature).toBe(-5.2);
    expect(result.condition.description).toBe("Heavy snow");
  });
});

describe("fetchWeather", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and parses weather data", async () => {
    const mockResponse = {
      current_weather: {
        temperature: 22.1,
        windspeed: 8.5,
        weathercode: 1,
      },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await fetchWeather(51.51, -0.13);
    expect(result.temperature).toBe(22.1);
    expect(result.windSpeed).toBe(8.5);
    expect(result.condition.description).toBe("Mainly clear");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.open-meteo.com/v1/forecast?latitude=51.51&longitude=-0.13&current_weather=true",
    );
  });

  it("throws on non-OK response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchWeather(0, 0)).rejects.toThrow("Weather API error: 500");
  });
});
