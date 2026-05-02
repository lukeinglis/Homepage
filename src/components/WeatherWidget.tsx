import { useState, useEffect } from "preact/hooks";
import { getLocation } from "../lib/geolocation";
import { fetchWeather, type WeatherData } from "../lib/weather";

type Status = "loading" | "ready" | "error";

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const coords = await getLocation();
        const data = await fetchWeather(coords.lat, coords.lon);
        if (!cancelled) {
          setWeather(data);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div class="widget weather-widget weather-loading" aria-busy="true">
        <div class="weather-skeleton">
          <div class="skeleton-line skeleton-temp" />
          <div class="skeleton-line skeleton-detail" />
        </div>
      </div>
    );
  }

  if (status === "error" || !weather) {
    return (
      <div class="widget weather-widget weather-error" role="alert">
        <p>Weather unavailable</p>
      </div>
    );
  }

  return (
    <div class="widget weather-widget">
      <div class="weather-main">
        <span class="weather-icon">{weather.condition.icon}</span>
        <span class="weather-temp">{Math.round(weather.temperature)}&deg;</span>
      </div>
      <p class="weather-condition">{weather.condition.description}</p>
      <p class="weather-wind">Wind: {weather.windSpeed} km/h</p>
    </div>
  );
}
