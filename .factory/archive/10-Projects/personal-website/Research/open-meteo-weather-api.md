---
tags:
  - factory
  - research
  - personal-website
project: personal-website
date: 2026-05-02
source: factory-archivist
---

# Research: Open-Meteo Weather API

## Finding

Open-Meteo is the ideal weather API for a client-side personal dashboard.

## Key Properties

- **No API key required**: Works from browser JavaScript immediately
- **Free for non-commercial use**: Perfect for a personal homepage
- **CORS-enabled**: Can be called directly from client-side JS (avoids a common pitfall with other weather APIs)
- **Geocoding API**: Separate endpoint for location lookup by name
- **WMO weather codes**: Standardized codes mappable to icons
- **High accuracy**: Sources data from national weather services globally

## Example Request

```
https://api.open-meteo.com/v1/forecast?latitude=42.36&longitude=-71.06&current_weather=true
```

Returns: temperature, wind speed, wind direction, weather code, time.

## Geolocation Strategy

1. Try browser `navigator.geolocation` API (requires user permission)
2. Fall back to config-defined default coordinates
3. Cache last-known coordinates in localStorage (avoids repeated permission prompts)

## Alternatives Rejected

| API | Issue |
|-----|-------|
| OpenWeatherMap | Requires API key |
| WeatherAPI | Requires API key |
| ZenQuotes | Limited CORS, medium reliability (not for weather but similar pattern) |

## Links

- [[personal-website]]
- [Open-Meteo](https://open-meteo.com/)
