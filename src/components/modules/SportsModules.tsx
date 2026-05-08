import { useState, useEffect } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { Icon } from '../scenes/Icons';
import { EmptyState } from './EmptyState';
import { GAMES, MY_TEAMS_DETAIL } from '../../data/scene-data';
import type { Game, TeamDetail } from '../../data/scene-data';
import { fetchScores } from '../../lib/sports-api.js';
import type { GameInfo } from '../../lib/sports-api.js';

const LG_LABEL: Record<string, string> = {
  mlb: "MLB", nfl: "NFL", nba: "NBA", cfb: "CFB", cbb: "CBB",
  epl: "EPL", ucl: "UCL", pga: "PGA", f1: "F1", tns: "TNS",
  ufc: "UFC", mls: "MLS", nhl: "NHL",
};
const LG_COLOR: Record<string, string> = {
  mlb: "#0c2340", nfl: "#013369", nba: "#c8102e", cfb: "#5a2d82", cbb: "#ff6900",
  epl: "#3d195b", ucl: "#00316f", pga: "#014421", f1: "#e10600", tns: "#b3d335",
  ufc: "#d20a0a", mls: "#001f5b", nhl: "#101820",
};

export function LeaguePip({ lg }: { lg: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 22, height: 22, borderRadius: 6, background: LG_COLOR[lg] || "#444",
      color: "#fff", fontFamily: "var(--mono)", fontSize: 9, fontWeight: 600,
      letterSpacing: "0.02em",
    }}>
      {LG_LABEL[lg]}
    </span>
  );
}

export function GameRow({ g, dense = false }: { g: Game; dense?: boolean }) {
  const showScore = typeof g.aw === "number";
  const teamish = g.home ? `${g.away} @ ${g.home}` : g.away;
  return (
    <div
      className={`flex items-center gap-3 ${dense ? "py-1.5" : "py-2"} px-2 rounded-md tile`}
      style={{ background: g.mine ? "rgba(255,180,80,0.06)" : "transparent" }}
    >
      <LeaguePip lg={g.lg} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <div className="font-medium leading-tight truncate" style={{ fontSize: "13px" }}>{teamish}</div>
          {g.mine && (
            <span className="font-mono uppercase" style={{ fontSize: "9px", letterSpacing: "0.05em", color: "#ffba6e" }}>
              ★ mine
            </span>
          )}
        </div>
        <div className="text-muted truncate" style={{ fontSize: "11px" }}>{g.stakes} · {g.net}</div>
      </div>
      {showScore && (
        <div
          className="font-mono tabnum font-medium leading-none px-2.5 py-1 rounded hairline"
          style={{ fontSize: "14px", background: "rgba(255,255,255,0.04)" }}
        >
          {g.aw}&ndash;{g.hs}
        </div>
      )}
      <div className="flex items-center gap-1.5 justify-end" style={{ width: 78 }}>
        {g.live && <><span className="live-dot" /><span className="sr-only">Live</span></>}
        <span className="font-mono tabnum" style={{ fontSize: "11px" }}>{g.state}</span>
      </div>
    </div>
  );
}

function LiveGameRow({ g }: { g: GameInfo }) {
  const showScore = g.awayScore !== null;
  const teamish = g.home ? g.away + " @ " + g.home : g.away;
  return (
    <div
      className="flex items-center gap-3 py-2 px-2 rounded-md tile"
      style={{ background: g.mine ? "rgba(255,180,80,0.06)" : "transparent" }}
    >
      <LeaguePip lg={g.league} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <div className="font-medium leading-tight truncate" style={{ fontSize: "13px" }}>{teamish}</div>
          {g.mine && (
            <span className="font-mono uppercase" style={{ fontSize: "9px", letterSpacing: "0.05em", color: "#ffba6e" }}>
              ★ mine
            </span>
          )}
        </div>
        <div className="text-muted truncate" style={{ fontSize: "11px" }}>{g.network}</div>
      </div>
      {showScore && (
        <div
          className="font-mono tabnum font-medium leading-none px-2.5 py-1 rounded hairline"
          style={{ fontSize: "14px", background: "rgba(255,255,255,0.04)" }}
        >
          {g.awayScore}&ndash;{g.homeScore}
        </div>
      )}
      <div className="flex items-center gap-1.5 justify-end" style={{ width: 78 }}>
        {g.live && <><span className="live-dot" /><span className="sr-only">Live</span></>}
        <span className="font-mono tabnum" style={{ fontSize: "11px" }}>{g.state}</span>
      </div>
    </div>
  );
}

export function SportsBoard({
  slate = "weekday_evening",
  title = "What's on",
  subtitle,
  hero = null,
}: {
  slate?: string;
  title?: string;
  subtitle?: string;
  hero?: ComponentChildren;
}) {
  const [liveGames, setLiveGames] = useState<GameInfo[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchScores()
      .then((games) => {
        if (!cancelled) {
          setLiveGames(games);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const staticGames = GAMES[slate];
  const hasLive = liveGames && liveGames.length > 0;
  const liveCount = liveGames?.filter((g) => g.live).length || 0;

  return (
    <div className="module p-5 module-enter" style={{ animationDelay: "60ms" }}>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="font-mono uppercase text-muted" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>
            Sports · {hasLive ? "live scores" : title}
          </div>
          <div className="font-serif leading-tight mt-0.5" style={{ fontSize: "22px" }}>
            {hasLive && liveCount > 0
              ? liveCount + " game" + (liveCount !== 1 ? "s" : "") + " in progress"
              : subtitle}
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-muted" style={{ fontSize: "10.5px" }}>
          {loading ? "Loading..." : <><Icon name="tv" size={13} /> on TV now</>}
        </div>
      </div>
      {hero}
      <div className="space-y-1">
        {hasLive
          ? liveGames.slice(0, 8).map((g, i) => <LiveGameRow key={i} g={g} />)
          : (staticGames || []).map((g, i) => <GameRow key={i} g={g} />)
        }
      </div>
      <div className="divider my-3" />
      <div className="flex items-center justify-between font-mono text-muted" style={{ fontSize: "10.5px" }}>
        <div>Tracking · NFL · NBA · MLB · CFB · CBB · EPL · UCL · F1 · PGA · ATP · UFC</div>
        <button aria-label="View all games" style={{ color: "inherit" }}>All games <Icon name="chevron" size={11} /></button>
      </div>
    </div>
  );
}

export function MyTeamsRail() {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "120ms" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono uppercase text-muted" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>
          My teams · today
        </div>
        <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>5 followed</div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {MY_TEAMS_DETAIL.map((t, i) => (
          <div
            key={i}
            className="rounded-lg p-2.5 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${t.cs[0]}, ${t.cs[1]})`, color: "#fff" }}
          >
            <div className="font-mono uppercase" style={{ fontSize: "10px", opacity: 0.75, letterSpacing: "0.05em" }}>
              {t.name.split(" ").slice(-1)[0]}
            </div>
            <div className="font-serif leading-tight" style={{ fontSize: "20px" }}>{t.abbr}</div>
            <div className="font-mono mt-1" style={{ fontSize: "10.5px", opacity: 0.9 }}>{t.next.line}</div>
            <div className="font-mono mt-0.5" style={{ fontSize: "10px", opacity: 0.7 }}>{t.next.when} · {t.next.net}</div>
            <div className="font-mono uppercase mt-1.5" style={{ fontSize: "8.5px", letterSpacing: "0.05em", opacity: 0.8, color: "#ffe4b5" }}>
              {t.badge}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeamDeepDive({ team }: { team?: TeamDetail }) {
  const t = team || MY_TEAMS_DETAIL[0];
  return (
    <div className="module p-0 overflow-hidden module-enter" style={{ animationDelay: "100ms" }}>
      <div className="p-5 relative" style={{ background: `linear-gradient(135deg, ${t.cs[0]}, ${t.cs[1]})`, color: "#fff" }}>
        <div
          className="absolute inset-0"
          style={{ opacity: 0.3, background: "radial-gradient(ellipse at 80% 0%, rgba(255,235,200,0.4), transparent 60%)" }}
        />
        <div className="relative">
          <div className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,235,200,0.85)" }}>
            {t.sport} · {t.rank}
          </div>
          <div className="font-serif italic leading-tight mt-1" style={{ fontSize: "34px", lineHeight: 1.05 }}>{t.name}</div>
          <div className="font-mono tabnum mt-1" style={{ fontSize: "12px", color: "rgba(255,235,200,0.85)" }}>{t.record}</div>
          <div
            className="mt-4 hairline rounded-md p-2.5"
            style={{ background: "rgba(0,0,0,0.18)", borderColor: "rgba(255,255,255,0.18)" }}
          >
            <div className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.05em", opacity: 0.8 }}>Next up</div>
            <div className="flex items-baseline justify-between mt-0.5">
              <div className="font-medium" style={{ fontSize: "14px" }}>{t.next.line}</div>
              <div className="font-mono tabnum" style={{ fontSize: "11px", opacity: 0.9 }}>
                {t.next.when} · {t.next.net}{t.next.spread ? " · " + t.next.spread : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2" style={{ gap: 0 }}>
        <div className="p-4 hairline" style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="font-mono uppercase text-muted mb-2" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>Recent form</div>
          <div className="flex gap-1 mb-2">
            {t.last.slice(0, 5).map((g: { res: string; line: string; note?: string }, i: number) => (
              <span
                key={i}
                className="font-mono inline-flex items-center justify-center rounded"
                style={{
                  fontSize: "10px", width: 20, height: 20,
                  background: g.res === "W" ? "rgba(154,213,156,0.18)" : g.res === "D" ? "rgba(247,184,107,0.18)" : "rgba(240,151,140,0.18)",
                  color: g.res === "W" ? "#9ad59c" : g.res === "D" ? "#f7b86b" : "#f0978c",
                }}
              >
                {g.res}
              </span>
            ))}
          </div>
          <div className="space-y-1" style={{ fontSize: "11.5px" }}>
            {t.last.slice(0, 3).map((g: { res: string; line: string; note?: string }, i: number) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="font-mono text-muted" style={{ fontSize: "10px", width: 12 }}>{g.res}</span>
                <span>{g.line}</span>
                {g.note && <span className="text-muted italic" style={{ fontSize: "10.5px" }}>{g.note}</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="font-mono uppercase text-muted mb-2" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>Key stats</div>
          <div className="space-y-1.5" style={{ fontSize: "12px" }}>
            {t.stat.map((s: [string, string], i: number) => (
              <div key={i} className="flex justify-between">
                <span className="text-muted">{s[0]}</span>
                <span className="font-mono tabnum">{s[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FantasyModule() {
  return <EmptyState icon="trophy" message="Connect fantasy leagues" delay="180ms" />;
}

export function EventTakeover() {
  return (
    <div
      className="module p-0 overflow-hidden module-enter"
      style={{
        animationDelay: "40ms",
        background: "linear-gradient(135deg, #0e3b1f 0%, #173d20 60%, #2c6435 100%)",
        color: "#f4efd8",
        border: "1px solid rgba(255,235,170,0.2)",
      }}
    >
      <div className="p-6 relative">
        <div
          className="absolute inset-0"
          style={{ opacity: 0.3, background: "radial-gradient(ellipse at 80% 0%, rgba(255,235,170,0.55), transparent 55%)" }}
        />
        <div className="absolute font-mono" style={{ right: 24, top: 24, fontSize: "10.5px", letterSpacing: "0.18em", color: "#d6c98a" }}>
          SUNDAY · APRIL 12
        </div>
        <div className="relative">
          <div className="font-mono uppercase" style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#d6c98a" }}>Masters Week</div>
          <div className="font-serif italic leading-tight mt-1" style={{ fontSize: "44px", lineHeight: 1.05, maxWidth: 640 }}>
            Augusta on a knife's edge. <span style={{ color: "#d6c98a" }}>Scheffler -14, McIlroy two back.</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="chip" style={{ background: "rgba(255,235,170,0.16)", borderColor: "rgba(255,235,170,0.3)", color: "#f4efd8" }}>
              <span className="live-dot" /><span className="sr-only">Live</span>R3 LIVE on ESPN+
            </span>
            <span className="chip" style={{ background: "rgba(255,235,170,0.10)", borderColor: "rgba(255,235,170,0.22)", color: "#f4efd8" }}>
              Final round 2:00 ET CBS
            </span>
          </div>
        </div>
      </div>
      <div
        className="grid grid-cols-6 px-6 py-3 gap-3 hairline"
        style={{ borderColor: "rgba(255,235,170,0.15)", background: "rgba(0,0,0,0.18)" }}
      >
        {([
          ["1", "Scheffler", "-14", "F"],
          ["2", "McIlroy", "-12", "F"],
          ["T3", "Schauffele", "-10", "F"],
          ["T3", "Åberg", "-10", "F"],
          ["5", "Morikawa", "-9", "F"],
          ["T6", "Hovland", "-8", "F"],
        ] as const).map((r, i) => (
          <div key={i} className="font-mono" style={{ fontSize: "11px", color: "#d6c98a" }}>
            <span style={{ opacity: 0.7 }}>{r[0]}</span>
            <div className="mt-0.5" style={{ fontSize: "12px", color: "#f4efd8", fontFamily: "var(--serif)", fontStyle: "italic" }}>{r[1]}</div>
            <div className="tabnum mt-0.5">{r[2]} <span style={{ opacity: 0.5 }}>{r[3]}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScoreRecap() {
  const [liveGames, setLiveGames] = useState<GameInfo[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchScores()
      .then((games) => { if (!cancelled) setLiveGames(games); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const staticFinals: { lg: string; line: string; sub: string; mine?: boolean }[] = [
    { lg: "epl", line: "Chelsea 2 — Man City 1", sub: "Palmer brace · Stamford Bridge", mine: true },
    { lg: "mlb", line: "Orioles 6 — Red Sox 4", sub: "4-game sweep · Henderson 2 HR", mine: true },
    { lg: "cfb", line: "Auburn 24 — Georgia 17", sub: "OT · Iron Bowl tune-up", mine: true },
    { lg: "pga", line: "Masters R3 — Scheffler -14", sub: "Leads McIlroy by 2 entering Sun." },
    { lg: "f1", line: "Miami GP Q · Verstappen P1", sub: "Norris P2, Leclerc P3" },
  ];

  const liveFinals = liveGames
    ?.filter((g) => !g.live && g.awayScore !== null)
    .slice(0, 5) || [];

  const hasLive = liveFinals.length > 0;

  return (
    <div className="module p-5 module-enter" style={{ animationDelay: "60ms" }}>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="font-mono uppercase text-muted" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Today's finals</div>
          <div className="font-serif leading-tight mt-0.5" style={{ fontSize: "22px" }}>
            {hasLive ? liveFinals.length + " final" + (liveFinals.length !== 1 ? "s" : "") : "A good Saturday."}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        {hasLive
          ? liveFinals.map((g, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 px-2 rounded-md tile"
              style={{ background: g.mine ? "rgba(255,180,80,0.06)" : "transparent" }}
            >
              <LeaguePip lg={g.league} />
              <div className="flex-1">
                <div className="font-medium leading-tight" style={{ fontSize: "13.5px" }}>
                  {g.away} {g.awayScore} — {g.home} {g.homeScore}
                </div>
                <div className="text-muted" style={{ fontSize: "11px" }}>{g.state} · {g.network}</div>
              </div>
              {g.mine && (
                <span className="font-mono uppercase" style={{ fontSize: "9.5px", letterSpacing: "0.05em", color: "#ffba6e" }}>★</span>
              )}
              <span className="font-mono text-muted" style={{ fontSize: "11px" }}>FINAL</span>
            </div>
          ))
          : staticFinals.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 px-2 rounded-md tile"
              style={{ background: f.mine ? "rgba(255,180,80,0.06)" : "transparent" }}
            >
              <LeaguePip lg={f.lg} />
              <div className="flex-1">
                <div className="font-medium leading-tight" style={{ fontSize: "13.5px" }}>{f.line}</div>
                <div className="text-muted" style={{ fontSize: "11px" }}>{f.sub}</div>
              </div>
              {f.mine && (
                <span className="font-mono uppercase" style={{ fontSize: "9.5px", letterSpacing: "0.05em", color: "#ffba6e" }}>★</span>
              )}
              <span className="font-mono text-muted" style={{ fontSize: "11px" }}>FINAL</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
