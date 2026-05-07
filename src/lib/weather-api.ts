const DEFAULT_LAT = 42.36;
const DEFAULT_LON = -71.06;

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  description: string;
  icon: string;
  highTemp: number;
  lowTemp: number;
  hourlyTemps: { hour: string; temp: number }[];
  city: string;
}

const WMO_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "sun" },
  1: { description: "Mainly clear", icon: "sun" },
  2: { description: "Partly cloudy", icon: "cloud-sun" },
  3: { description: "Overcast", icon: "cloud" },
  45: { description: "Fog", icon: "cloud" },
  48: { description: "Rime fog", icon: "cloud" },
  51: { description: "Light drizzle", icon: "cloud-rain" },
  53: { description: "Drizzle", icon: "cloud-rain" },
  55: { description: "Heavy drizzle", icon: "cloud-rain" },
  61: { description: "Light rain", icon: "cloud-rain" },
  63: { description: "Rain", icon: "cloud-rain" },
  65: { description: "Heavy rain", icon: "cloud-rain" },
  71: { description: "Light snow", icon: "cloud" },
  73: { description: "Snow", icon: "cloud" },
  75: { description: "Heavy snow", icon: "cloud" },
  80: { description: "Light showers", icon: "cloud-rain" },
  81: { description: "Showers", icon: "cloud-rain" },
  82: { description: "Heavy showers", icon: "cloud-rain" },
  95: { description: "Thunderstorm", icon: "cloud-rain" },
};

export async function fetchWeather(
  lat?: number,
  lon?: number,
): Promise<WeatherData> {
  const latitude = lat ?? DEFAULT_LAT;
  const longitude = lon ?? DEFAULT_LON;

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,weather_code,wind_speed_10m",
    hourly: "temperature_2m",
    daily: "temperature_2m_max,temperature_2m_min",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
    forecast_days: "1",
  });

  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?" + params,
  );
  if (!response.ok) throw new Error("Weather fetch failed");

  const data = await response.json();

  const wmoCode = data.current?.weather_code ?? 0;
  const wmo = WMO_CODES[wmoCode] || { description: "Unknown", icon: "cloud" };

  const hourlyTemps: { hour: string; temp: number }[] = [];
  const hours: string[] = data.hourly?.time ?? [];
  const temps: number[] = data.hourly?.temperature_2m ?? [];
  for (let i = 0; i < hours.length && i < 24; i += 2) {
    const h = new Date(hours[i]).getHours();
    const label =
      h === 0
        ? "12a"
        : h < 12
          ? h + "a"
          : h === 12
            ? "12p"
            : h - 12 + "p";
    const t = temps[i];
    hourlyTemps.push({
      hour: label,
      temp: Number.isFinite(t) ? Math.round(t) : 0,
    });
  }

  let city = "Boston";
  try {
    const geoRes = await fetch(
      "https://geocoding-api.open-meteo.com/v1/reverse?" +
        new URLSearchParams({
          latitude: String(latitude),
          longitude: String(longitude),
          count: "1",
          language: "en",
          format: "json",
        }),
    );
    const geoData = await geoRes.json();
    const place = geoData?.results?.[0];
    city = place?.name || place?.admin2 || place?.admin1 || "Boston";
  } catch {
    /* use default */
  }

  const temp = data.current?.temperature_2m;
  const wind = data.current?.wind_speed_10m;
  const hi = data.daily?.temperature_2m_max?.[0];
  const lo = data.daily?.temperature_2m_min?.[0];

  return {
    temperature: Number.isFinite(temp) ? Math.round(temp) : 0,
    weatherCode: wmoCode,
    windSpeed: Number.isFinite(wind) ? Math.round(wind) : 0,
    description: wmo.description,
    icon: wmo.icon,
    highTemp: Number.isFinite(hi) ? Math.round(hi) : 0,
    lowTemp: Number.isFinite(lo) ? Math.round(lo) : 0,
    hourlyTemps,
    city,
  };
}

const GEO_CACHE_KEY = "homepage_geo";
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000;

export function getCachedLocation(): { lat: number; lon: number } | null {
  try {
    const cached = localStorage.getItem(GEO_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > GEO_CACHE_TTL) return null;
    return { lat: parsed.lat, lon: parsed.lon };
  } catch {
    return null;
  }
}

export function cacheLocation(lat: number, lon: number): void {
  try {
    localStorage.setItem(
      GEO_CACHE_KEY,
      JSON.stringify({ lat, lon, timestamp: Date.now() }),
    );
  } catch {
    /* quota exceeded */
  }
}

export function requestLocation(): Promise<{
  lat: number;
  lon: number;
} | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        cacheLocation(loc.lat, loc.lon);
        resolve(loc);
      },
      () => resolve(null),
      { timeout: 5000, maximumAge: 300000 },
    );
  });
}
