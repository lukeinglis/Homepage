import { useState, useEffect } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { Icon } from './Icons';
import { CmdK } from './CmdK';
import { SceneWeekdayAM, SceneWeekdayPM, SceneWeekendAM, SceneWeekendPM } from './Scenes';

interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

interface SceneConfig {
  id: string;
  label: string;
  time: string;
  Comp: (p: { teamNight: string | null; userName?: string }) => ComponentChildren;
}

const SCENES: SceneConfig[] = [
  { id: "wkdy_am", label: "Wkdy AM", time: "Tue · 8:18 AM", Comp: (p) => <SceneWeekdayAM {...p} /> },
  { id: "wkdy_pm", label: "Wkdy PM", time: "Tue · 6:18 PM", Comp: (p) => <SceneWeekdayPM {...p} /> },
  { id: "wknd_am", label: "Wknd AM", time: "Sat · 9:14 AM", Comp: (p) => <SceneWeekendAM {...p} /> },
  { id: "wknd_pm", label: "Wknd PM", time: "Sat · 7:52 PM", Comp: (p) => <SceneWeekendPM {...p} /> },
];

const TEAM_NIGHTS = [
  { id: null as string | null, label: "Default", hint: "Boston / scene art" },
  { id: "auburn", label: "Auburn", hint: "Game day · Jordan-Hare" },
  { id: "chelsea", label: "Chelsea", hint: "Matchday · Stamford Bridge" },
  { id: "camden", label: "Orioles", hint: "Camden Yards · first pitch" },
];

export function detectScene(): number {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isWeekend = day === 0 || day === 6;
  if (isWeekend) return hour < 14 ? 2 : 3;
  return hour < 14 ? 0 : 1;
}

export function App() {
  const [sceneIdx, setSceneIdx] = useState(() => {
    try {
      const overrideTs = Number(localStorage.getItem("homepage_scene_override") || "0");
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);
      if (overrideTs > todayMidnight.getTime()) {
        const v = localStorage.getItem("homepage_scene");
        if (v) return Number(v);
      }
    } catch { /* empty */ }
    return detectScene();
  });
  const [teamNight, setTeamNight] = useState<string | null>(() => {
    try { return localStorage.getItem("homepage_team") || null; } catch { return null; }
  });
  const [user, setUser] = useState<UserInfo | null>(null);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => { try { localStorage.setItem("homepage_scene", String(sceneIdx)); } catch { /* empty */ } }, [sceneIdx]);
  useEffect(() => {
    try {
      if (teamNight) { localStorage.setItem("homepage_team", teamNight); }
      else { localStorage.removeItem("homepage_team"); }
    } catch { /* empty */ }
  }, [teamNight]);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      try {
        const overrideTs = Number(localStorage.getItem("homepage_scene_override") || "0");
        const now = Date.now();
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        if (overrideTs > todayMidnight.getTime() && overrideTs <= now) return;
      } catch { /* empty */ }
      const detected = detectScene();
      setSceneIdx(prev => {
        if (prev === detected) return prev;
        setTransitioning(true);
        setTimeout(() => setTransitioning(false), 220);
        return detected;
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdkOpen(o => !o); }
      else if (e.key === "Escape" && cmdkOpen) { setCmdkOpen(false); }
      else if (isMod && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        switchScene(e.key === "ArrowRight" ? (sceneIdx + 1) % 4 : (sceneIdx + 3) % 4);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cmdkOpen, sceneIdx]);

  function switchScene(i: number) {
    if (i === sceneIdx) return;
    try { localStorage.setItem("homepage_scene_override", String(Date.now())); } catch { /* empty */ }
    setTransitioning(true);
    setTimeout(() => { setSceneIdx(i); setTransitioning(false); }, 220);
  }
  function pickTeamNight(id: string | null) {
    if (id === teamNight) return;
    setTransitioning(true);
    setTimeout(() => { setTeamNight(id); setTransitioning(false); }, 220);
  }

  const Scene = SCENES[sceneIdx].Comp;
  const firstName = user?.name?.split(" ")[0];

  return (
    <div style={{ minHeight: "100vh", overflow: "auto" }} className="scrolly">
      <div style={{
        opacity: transitioning ? 0 : 1,
        transition: "opacity 600ms cubic-bezier(.22,1,.36,1)",
      }} key={sceneIdx + "-" + (teamNight || "x")}>
        {Scene({ teamNight, userName: firstName })}
      </div>

      {user && (
        <div className="fixed z-40 flex items-center gap-2"
          style={{ top: 20, left: 20 }}>
          {user.picture && (
            <img
              src={user.picture}
              alt=""
              referrerPolicy="no-referrer"
              style={{
                width: 28, height: 28, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
          )}
          <a href="/api/auth/logout"
            className="font-mono"
            style={{
              fontSize: "10.5px",
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              transition: "color 200ms",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.85)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
          >Sign out</a>
        </div>
      )}

      <SceneSwitcher current={sceneIdx} onChange={switchScene} />
      <TeamSwitcher current={teamNight} onChange={pickTeamNight} />

      <button onClick={() => setCmdkOpen(true)}
        aria-label="Open command palette"
        className="fixed z-40 flex items-center gap-2 rounded-full"
        style={{
          bottom: 24, left: 24,
          padding: "8px 14px",
          background: "rgba(20,18,22,0.66)",
          backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.92)",
          boxShadow: "0 8px 28px -6px rgba(0,0,0,0.5)",
        }}>
        <Icon name="search" size={13} />
        <span className="font-mono" style={{ fontSize: "11px" }}>Search anything</span>
        <span className="kbd">⌘K</span>
      </button>

      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
    </div>
  );
}

function SceneSwitcher({ current, onChange }: { current: number; onChange: (i: number) => void }) {
  return (
    <div className="fixed z-40 flex items-center gap-1.5 px-1.5 py-1.5 rounded-full"
      style={{
        top: 20, right: 20,
        background: "rgba(20,18,22,0.6)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 10px 30px -8px rgba(0,0,0,0.5)",
      }}>
      {SCENES.map((s, i) => (
        <button key={s.id} onClick={() => onChange(i)}
          aria-label={`Switch to ${s.label} scene`}
          aria-pressed={i === current}
          className="px-3 py-1.5 rounded-full transition-all"
          style={{
            background: i === current ? "rgba(255,255,255,0.16)" : "transparent",
            color: i === current ? "#fff" : "rgba(255,255,255,0.65)",
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.02em",
          }}
          title={s.time}>
          {s.label}
        </button>
      ))}
    </div>
  );
}

function TeamSwitcher({ current, onChange }: { current: string | null; onChange: (id: string | null) => void }) {
  return (
    <div className="fixed z-40 flex items-center gap-1 px-1.5 py-1.5 rounded-full"
      style={{
        top: 20, left: "50%", transform: "translateX(-50%)",
        background: "rgba(20,18,22,0.6)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 10px 30px -8px rgba(0,0,0,0.5)",
      }}>
      <span className="font-mono uppercase px-2.5" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.55)" }}>Match</span>
      {TEAM_NIGHTS.map((t) => (
        <button key={t.id || "default"} onClick={() => onChange(t.id)}
          aria-label={`Switch to ${t.label} theme`}
          aria-pressed={t.id === current}
          className="px-3 py-1.5 rounded-full transition-all"
          style={{
            background: t.id === current ? "rgba(255,255,255,0.16)" : "transparent",
            color: t.id === current ? "#fff" : "rgba(255,255,255,0.65)",
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.02em",
          }}
          title={t.hint}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
