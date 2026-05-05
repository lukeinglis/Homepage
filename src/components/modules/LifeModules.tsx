import { useState, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import { Icon } from '../scenes/Icons';
import { WEATHER, MARKETS, NETWORTH, NEWS, NOW_PLAYING, SHOP, QUOTES } from '../../data/scene-data';

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

function greetingFor(scene: string, name: string) {
  const map: Record<string, { greet: string; sub: string; date: string }> = {
    wkdy_am: {
      greet: "Good morning, " + name + ".",
      sub: "Calm Tuesday over the Charles. Three deep blocks scheduled.",
      date: "Tuesday · May 5",
    },
    wkdy_pm: {
      greet: "Easy into the evening, " + name + ".",
      sub: "Boston’s hung out the lights. Polenta on at six.",
      date: "Tuesday · May 5",
    },
    wknd_am: {
      greet: "Saturday’s wide open, " + name + ".",
      sub: "Auburn at 3:30. Masters from now until late.",
      date: "Saturday · April 12",
    },
    wknd_pm: {
      greet: "Settle in, " + name + ".",
      sub: "Wolves at 8:30. Short ribs already on.",
      date: "Saturday · April 12",
    },
  };
  return map[scene];
}

const SCENE_TIME: Record<string, string> = {
  wkdy_am: "7:42",
  wkdy_pm: "6:18",
  wknd_am: "9:14",
  wknd_pm: "7:52",
};

export function Greeting({ scene, name = "Luke" }: GreetingProps): JSX.Element {
  const { city, status } = useDetectedCity("Boston");
  const dt = greetingFor(scene, name);
  const time = SCENE_TIME[scene];
  const ampm = scene.endsWith("_am") ? "AM" : "PM";

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
          {dt?.date}
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
        {dt?.greet}{" "}
        <span className="italic" style={{ opacity: 0.78 }}>{dt?.sub}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

interface SparklineProps {
  values: number[];
  up: boolean;
}

export function Sparkline({ values, up }: SparklineProps): JSX.Element {
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
      <path d={d} className="spark" stroke={up ? "#9ad59c" : "#f0978c"} strokeWidth="1.4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// WeatherModule
// ---------------------------------------------------------------------------

interface WeatherModuleProps {
  scene: string;
}

export function WeatherModule({ scene }: WeatherModuleProps): JSX.Element {
  const weatherKey: Record<string, string> = {
    wkdy_am: "morning",
    wkdy_pm: "evening",
    wknd_am: "wknd_am",
    wknd_pm: "wknd_pm",
  };
  const w = WEATHER[weatherKey[scene]];

  const hours: [string, number][] = scene.endsWith("_am")
    ? [["6a", 54], ["8a", 58], ["10a", 62], ["12p", 66], ["2p", 70], ["4p", 69], ["6p", 65], ["8p", 60]]
    : [["12p", 66], ["2p", 70], ["4p", 69], ["6p", 65], ["8p", 60], ["10p", 56], ["12a", 53], ["2a", 51]];

  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "60ms" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon name={w.icon} size={14} />
          <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>{w.city}</div>
        </div>
        <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>{w.cond}</div>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="font-serif leading-none tabnum" style={{ fontSize: "44px" }}>{w.t}°</div>
        <div className="font-mono text-muted tabnum" style={{ fontSize: "11px" }}>{w.lo}° · {w.hi}°</div>
      </div>
      <div className="mt-3 flex items-end gap-1.5" style={{ height: 42 }}>
        {hours.map((h, i) => {
          const pct = (h[1] - 48) / 26;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${pct * 100}%`,
                  minHeight: 6,
                  background: "linear-gradient(180deg, rgba(255,180,120,0.85), rgba(255,180,120,0.25))",
                }}
              />
              <div className="font-mono text-muted tabnum" style={{ fontSize: "9px" }}>{h[0]}</div>
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
              <div className="font-mono tabnum" style={{ fontSize: "10.5px", color: m.up ? "#9ad59c" : "#f0978c" }}>{m.chg}</div>
            </div>
            <div className="flex items-baseline justify-between mt-0.5">
              <div className="font-serif tabnum" style={{ fontSize: "18px" }}>{m.val}</div>
              <Sparkline values={m.spark} up={m.up} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NetWorthModule
// ---------------------------------------------------------------------------

export function NetWorthModule(): JSX.Element {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "140ms" }}>
      <div className="font-mono uppercase text-muted mb-1" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>
        Net worth · glance
      </div>
      <div className="font-serif leading-none tabnum mt-1" style={{ fontSize: "28px" }}>{NETWORTH.total}</div>
      <div className="font-mono mt-1" style={{ fontSize: "10.5px", color: "#9ad59c" }}>{NETWORTH.delta}</div>
      <div className="divider my-3" />
      <div className="space-y-1.5" style={{ fontSize: "12px" }}>
        <div className="flex justify-between">
          <span className="text-muted">Brokerage</span>
          <span className="font-mono tabnum">$268.4k</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">401(k)</span>
          <span className="font-mono tabnum">$184.2k</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Cash</span>
          <span className="font-mono tabnum">$34.6k</span>
        </div>
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
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "160ms" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>
          News · curated
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
        {feeds.map((f) => (
          <div key={f}>
            <div className="font-mono uppercase text-muted mb-1.5" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
              {FEED_LABELS[f]}
            </div>
            <ul className="space-y-1.5">
              {(NEWS[f] || []).map((h, i) => (
                <li key={i} className="leading-snug" style={{ fontSize: "12.5px" }}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
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
            <span className="live-dot" style={{ background: "#7adfff" }} />
            Now playing · {np.source}
          </div>
          <div className="font-medium font-serif italic leading-tight mt-0.5 truncate" style={{ fontSize: "13px" }}>
            {np.title}
          </div>
          <div className="font-mono text-muted truncate" style={{ fontSize: "10.5px" }}>{np.artist}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="hairline rounded-full flex items-center justify-center"
            style={{ width: 28, height: 28 }}
          >
            <Icon name="pause" size={12} />
          </button>
          <button
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
// ShoppingModule
// ---------------------------------------------------------------------------

export function ShoppingModule(): JSX.Element {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "240ms" }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon name="shopping" size={14} />
        <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>
          Cart · wishlist
        </div>
      </div>
      <div className="space-y-2">
        {SHOP.map((s, i) => (
          <div key={i} style={{ fontSize: "12.5px" }}>
            <div className="font-serif">{s.what}</div>
            <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>{s.at} · {s.state}</div>
          </div>
        ))}
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
  const q = QUOTES[idx];
  return (
    <div className="module-enter" style={{ animationDelay: "300ms" }}>
      <div className="font-serif italic leading-snug" style={{ maxWidth: 320, opacity: 0.78, fontSize: "16px" }}>
        &ldquo;{q.q}&rdquo;{" "}
        <span className="font-mono not-italic text-muted" style={{ fontSize: "10.5px" }}>{q.w}</span>
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
