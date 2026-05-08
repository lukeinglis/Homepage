import { useState, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import { Icon } from '../scenes/Icons';
import { MARKETS, STOCKS, NEWS, NOW_PLAYING, QUOTES } from '../../data/scene-data.js';
import { fetchWeather, getCachedLocation, requestLocation } from '../../lib/weather-api.js';
import type { WeatherData } from '../../lib/weather-api.js';
import { fetchNews } from '../../lib/news-api.js';
import type { NewsItem } from '../../lib/news-api.js';

// ---------------------------------------------------------------------------
// useDetectedCity
// ---------------------------------------------------------------------------

export function useDetectedCity(fallback = "Boston"): { city: string; status: string } {
  const [city, setCity] = useState<string>(() => {
    try {
      const cached = JSON.parse(localStorage.getItem("homepage_city") || "null");
      if (cached && cached.name && (Date.now() - cached.t) < 1000 * 60 * 60 * 24) return cached.name;
    } catch { /* ignore */ }
    return fallback;
  });
  const [status, setStatus] = useState<string>("cached");

  useEffect(() => {
    if (!navigator.geolocation) return;
    setStatus("detecting");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const r = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`
          );
          const j = await r.json();
          const place = j?.results?.[0];
          const name = place?.name || place?.admin2 || place?.admin1 || fallback;
          setCity(name);
          setStatus("live");
          try {
            localStorage.setItem("homepage_city", JSON.stringify({ name, t: Date.now() }));
          } catch { /* ignore */ }
        } catch {
          setStatus("error");
        }
      },
      () => setStatus("denied"),
      { timeout: 5000, maximumAge: 1000 * 60 * 60 },
    );
  }, []);

  return { city, status };
}

// ---------------------------------------------------------------------------
// Greeting
// ---------------------------------------------------------------------------

interface GreetingProps {
  scene: string;
  name?: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function timeOfDayGreeting(hour: number, name: string): { greet: string; sub: string } {
  if (hour < 12) return { greet: `Good morning, ${name}.`, sub: "Fresh start. Make it count." };
  if (hour < 17) return { greet: `Good afternoon, ${name}.`, sub: "Steady through the middle stretch." };
  return { greet: `Good evening, ${name}.`, sub: "Wind it down. Tomorrow’s got its own plans." };
}

function formatDate(now: Date): string {
  return `${DAYS[now.getDay()]} · ${MONTHS[now.getMonth()]} ${now.getDate()}`;
}

function formatTime(now: Date): { time: string; ampm: string } {
  let h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const time = `${h}:${m.toString().padStart(2, "0")}`;
  return { time, ampm };
}

export function Greeting({ name = "Luke" }: GreetingProps): JSX.Element {
  const { city, status } = useDetectedCity("Boston");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const dt = timeOfDayGreeting(now.getHours(), name);
  const dateStr = formatDate(now);
  const { time, ampm } = formatTime(now);

  const dotTitle =
    status === "live" ? "Detected from your location" :
    status === "detecting" ? "Detecting location…" :
    status === "denied" ? "Location denied — using last known" :
    status === "cached" ? "Last detected location" : "Default location";

  const dotBg =
    status === "live" ? "#9ad59c" :
    status === "detecting" ? "#f7b86b" : "rgba(255,255,255,0.4)";

  const dotShadow = status === "live" ? "0 0 8px rgba(154,213,156,0.8)" : "none";
  const dotAnim = status === "detecting" ? "pulseslow 1.4s ease-in-out infinite" : "none";

  return (
    <div className="module-enter" style={{ animationDelay: "0ms" }}>
      <div className="flex items-baseline gap-4">
        <div className="font-mono uppercase text-muted" style={{ fontSize: "11px", letterSpacing: "0.18em" }}>
          {dateStr}
        </div>
        <div className="font-mono tabnum text-muted flex items-center gap-1.5" style={{ fontSize: "11px" }}>
          <span>{time} {ampm} · {city}</span>
          <span
            title={dotTitle}
            style={{
              display: "inline-block",
              width: 5,
              height: 5,
              borderRadius: 99,
              background: dotBg,
              boxShadow: dotShadow,
              animation: dotAnim,
            }}
          />
        </div>
      </div>
      <div className="font-serif mt-2" style={{ fontSize: "56px", lineHeight: 1.02, maxWidth: 860, letterSpacing: "-0.012em" }}>
        {dt.greet}{" "}
        <span className="italic" style={{ opacity: 0.78 }}>{dt.sub}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

interface SparklineProps {
  values: number[];
  color: string;
}

export function Sparkline({ values, color }: SparklineProps): JSX.Element {
  const w = 60;
  const h = 22;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    h - ((v - min) / range) * h,
  ]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return (
    <svg width={w} height={h}>
      <path d={d} className="spark" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// WeatherModule
// ---------------------------------------------------------------------------

export function WeatherModule(): JSX.Element {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        let loc = getCachedLocation();
        if (!loc) loc = await requestLocation();
        const data = await fetchWeather(loc?.lat, loc?.lon);
        if (!cancelled) {
          setWeather(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }
    load();
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="module p-4 module-enter" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em", opacity: 0.6 }}>
            Loading weather...
          </div>
        </div>
        <div style={{ height: 60, background: "rgba(128,128,128,0.1)", borderRadius: 8 }} />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="module p-4 module-enter" style={{ animationDelay: "60ms" }}>
        <div className="font-mono text-muted" style={{ fontSize: "11px" }}>Weather unavailable</div>
      </div>
    );
  }

  const temps = weather.hourlyTemps.map((h) => h.temp);
  const minT = Math.min(...temps.filter(Number.isFinite));
  const maxT = Math.max(...temps.filter(Number.isFinite));
  const range = maxT - minT || 1;

  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "60ms" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon name={weather.icon} size={14} />
          <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>{weather.city}</div>
        </div>
        <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>{weather.description}</div>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="font-serif leading-none tabnum" style={{ fontSize: "44px" }}>{weather.temperature}°</div>
        <div className="font-mono text-muted tabnum" style={{ fontSize: "11px" }}>{weather.lowTemp}° · {weather.highTemp}°</div>
      </div>
      <div className="mt-3 flex items-end gap-1.5" style={{ height: 42 }}>
        {weather.hourlyTemps.map((h, i) => {
          const pct = (h.temp - minT) / range;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${Math.max(pct, 0) * 100}%`,
                  minHeight: 6,
                  background: "linear-gradient(180deg, rgba(255,180,120,0.85), rgba(255,180,120,0.25))",
                }}
              />
              <div className="font-mono text-muted tabnum" style={{ fontSize: "9px" }}>{h.hour}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MarketsModule
// ---------------------------------------------------------------------------

interface MarketsModuleProps {
  phase?: string;
}

export function MarketsModule({ phase = "open" }: MarketsModuleProps): JSX.Element {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>
          Markets · {phase === "open" ? "pre-open" : "after-hours"}
        </div>
        <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>
          {phase === "open" ? "9:30 ET in 1h 48m" : "Closed at 4:00 ET"}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {MARKETS.map((m, i) => (
          <div key={i} className="hairline rounded-md p-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-baseline justify-between">
              <div className="font-mono uppercase text-muted" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>{m.sym}</div>
              <div className="font-mono tabnum" style={{ fontSize: "10.5px", color: m.color }}>{m.chg}</div>
            </div>
            <div className="flex items-baseline justify-between mt-0.5">
              <div className="font-serif tabnum" style={{ fontSize: "18px" }}>{m.val}</div>
              <Sparkline values={m.data} color={m.color} />
            </div>
          </div>
        ))}
      </div>
      <div className="divider my-3" />
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono uppercase text-muted" style={{ fontSize: "10px", letterSpacing: "0.16em" }}>Portfolio · watchlist</div>
        <div className="font-mono text-muted" style={{ fontSize: "10px" }}>{STOCKS.length} tickers</div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {STOCKS.map((s, i) => (
          <div key={i} className="hairline rounded-md px-2 py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>{s.sym}</div>
            <div className="flex items-baseline justify-between mt-0.5">
              <div className="font-mono tabnum" style={{ fontSize: "11px" }}>{s.val}</div>
              <div className="font-mono tabnum" style={{ fontSize: "10px", color: s.color }}>{s.chg}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NewsModule
// ---------------------------------------------------------------------------

interface NewsModuleProps {
  feeds?: string[];
  hero?: string | null;
}

const FEED_LABELS: Record<string, string> = {
  bloomberg: "Bloomberg",
  hn: "Hacker News",
  nyt: "NYT",
  espn: "ESPN",
  cnn: "CNN",
};

export function NewsModule({ feeds = ["bloomberg", "hn"], hero = null }: NewsModuleProps): JSX.Element {
  const [liveNews, setLiveNews] = useState<Record<string, NewsItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      feeds.map((f) =>
        fetchNews(f)
          .then((items) => ({ feed: f, items }))
          .catch(() => ({ feed: f, items: [] as NewsItem[] }))
      )
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, NewsItem[]> = {};
      for (const r of results) {
        if (r.items.length > 0) map[r.feed] = r.items;
      }
      setLiveNews(map);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [feeds.join(",")]);

  const hasLive = Object.keys(liveNews).length > 0;

  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "160ms" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>
          News · {hasLive ? "live" : "curated"}
        </div>
        <div className="flex gap-1">
          {feeds.map((f) => (
            <span key={f} className="chip">{FEED_LABELS[f]}</span>
          ))}
        </div>
      </div>
      {hero && (
        <div className="font-serif leading-tight mb-3" style={{ fontSize: "18px" }}>{hero}</div>
      )}
      <div className="space-y-3">
        {feeds.map((f) => {
          const live = liveNews[f];
          return (
            <div key={f}>
              <div className="font-mono uppercase text-muted mb-1.5" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
                {FEED_LABELS[f]}
              </div>
              <ul className="space-y-1.5">
                {live ? (
                  live.map((item, i) => (
                    <li key={i} className="leading-snug" style={{ fontSize: "12.5px" }}>
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover-link">{item.title}</a>
                      ) : item.title}
                    </li>
                  ))
                ) : (
                  (NEWS[f] || []).map((h, i) => (
                    <li key={i} className="leading-snug" style={{ fontSize: "12.5px" }}>{h}</li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NowPlaying
// ---------------------------------------------------------------------------

export function NowPlaying(): JSX.Element {
  const np = NOW_PLAYING;
  return (
    <div className="module p-3 module-enter" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-3">
        <div
          className="rounded flex-none relative overflow-hidden"
          style={{ width: 48, height: 48, background: np.cover }}
        >
          <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 18px rgba(0,0,0,0.4)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono uppercase text-muted flex items-center gap-1.5" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
            <span className="live-dot" style={{ background: "#7adfff" }} /><span className="sr-only">Live</span>
            Now playing · {np.source}
          </div>
          <div className="font-medium font-serif italic leading-tight mt-0.5 truncate" style={{ fontSize: "13px" }}>
            {np.title}
          </div>
          <div className="font-mono text-muted truncate" style={{ fontSize: "10.5px" }}>{np.artist}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Pause"
            className="hairline rounded-full flex items-center justify-center"
            style={{ width: 28, height: 28 }}
          >
            <Icon name="pause" size={12} />
          </button>
          <button
            aria-label="Skip to next track"
            className="hairline rounded-full flex items-center justify-center"
            style={{ width: 28, height: 28 }}
          >
            <Icon name="skip" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// QuoteModule
// ---------------------------------------------------------------------------

interface QuoteModuleProps {
  idx?: number;
}

export function QuoteModule({ idx = 0 }: QuoteModuleProps): JSX.Element {
  const q = QUOTES[idx % QUOTES.length];
  return (
    <div className="module-enter" style={{ animationDelay: "300ms" }}>
      <div className="font-serif italic leading-snug" style={{ maxWidth: 320, opacity: 0.78, fontSize: "16px" }}>
        &ldquo;{q.text}&rdquo;{" "}
        <span className="font-mono not-italic text-muted" style={{ fontSize: "10.5px" }}>{q.author}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PinnedRow
// ---------------------------------------------------------------------------

interface Pin {
  i: string;
  n: string;
}

interface PinnedRowProps {
  pins?: Pin[];
}

export function PinnedRow({ pins = [] }: PinnedRowProps): JSX.Element {
  return (
    <div className="flex flex-wrap gap-1.5">
      {pins.map((p, i) => (
        <button
          key={i}
          aria-label={`Open ${p.n}`}
          className="tile hairline rounded-md px-2.5 py-1.5 flex items-center gap-1.5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <Icon name={p.i} size={12} />
          <span className="font-mono" style={{ fontSize: "11px" }}>{p.n}</span>
        </button>
      ))}
    </div>
  );
}
