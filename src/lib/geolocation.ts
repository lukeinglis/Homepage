import { defaultLocation } from "../config/defaults";

const STORAGE_KEY = "homepage-location";
const DENIED_KEY = "homepage-location-denied";

export interface Coordinates {
  lat: number;
  lon: number;
}

function getCachedLocation(): Coordinates | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Coordinates;
    if (
      typeof parsed.lat === "number" &&
      typeof parsed.lon === "number" &&
      isFinite(parsed.lat) &&
      isFinite(parsed.lon)
    ) {
      return parsed;
    }
  } catch {
    // Corrupted data, ignore
  }
  return null;
}

function cacheLocation(coords: Coordinates): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
  } catch {
    // Storage full or unavailable, silently ignore
  }
}

function wasDenied(): boolean {
  try {
    return sessionStorage.getItem(DENIED_KEY) === "true";
  } catch {
    return false;
  }
}

function markDenied(): void {
  try {
    sessionStorage.setItem(DENIED_KEY, "true");
  } catch {
    // Unavailable, silently ignore
  }
}

function getDefaultCoordinates(): Coordinates {
  return {
    lat: defaultLocation.latitude,
    lon: defaultLocation.longitude,
  };
}

function requestBrowserLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation not available"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000, maximumAge: 300000 },
    );
  });
}

export async function getLocation(): Promise<Coordinates> {
  const cached = getCachedLocation();
  if (cached) return cached;

  if (wasDenied()) return getDefaultCoordinates();

  try {
    const coords = await requestBrowserLocation();
    cacheLocation(coords);
    return coords;
  } catch {
    markDenied();
    return getDefaultCoordinates();
  }
}
