// Top-level app: scene orchestration, transitions, Cmd+K, scene switcher.

const SCENES = [
  { id: "wkdy_am", label: "Wkdy AM", time: "Tue · 8:18 AM",  Comp: (p) => <SceneWeekdayAM {...p}/> },
  { id: "wkdy_pm", label: "Wkdy PM", time: "Tue · 6:18 PM",  Comp: (p) => <SceneWeekdayPM {...p}/> },
  { id: "wknd_am", label: "Wknd AM", time: "Sat · 9:14 AM",  Comp: (p) => <SceneWeekendAM {...p}/> },
  { id: "wknd_pm", label: "Wknd PM", time: "Sat · 7:52 PM",  Comp: (p) => <SceneWeekendPM {...p}/> },
];

const TEAM_NIGHTS = [
  { id: null,         label: "Default",  hint: "Boston / scene art" },
  { id: "auburn",     label: "Auburn",   hint: "Game day · Jordan-Hare" },
  { id: "chelsea",    label: "Chelsea",  hint: "Matchday · Stamford Bridge" },
  { id: "camden",     label: "Orioles",  hint: "Camden Yards · first pitch" },
];

function App() {
  const [sceneIdx, setSceneIdx] = React.useState(() => {
    try { const v = localStorage.getItem("homepage_scene"); return v ? Number(v) : 0; } catch { return 0; }
  });
  const [teamNight, setTeamNight] = React.useState(() => {
    try { return localStorage.getItem("homepage_team") || null; } catch { return null; }
  });
  const [cmdkOpen, setCmdkOpen] = React.useState(false);
  const [transitioning, setTransitioning] = React.useState(false);

  React.useEffect(() => { try { localStorage.setItem("homepage_scene", String(sceneIdx)); } catch {} }, [sceneIdx]);
  React.useEffect(() => { try { teamNight ? localStorage.setItem("homepage_team", teamNight) : localStorage.removeItem("homepage_team"); } catch {} }, [teamNight]);

  React.useEffect(() => {
    const handler = (e) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdkOpen(o => !o); }
      else if (e.key === "Escape" && cmdkOpen) { setCmdkOpen(false); }
      else if (isMod && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        switchScene(e.key === "ArrowRight" ? (sceneIdx+1) % 4 : (sceneIdx+3) % 4);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cmdkOpen, sceneIdx]);

  function switchScene(i) {
    if (i === sceneIdx) return;
    setTransitioning(true);
    setTimeout(() => { setSceneIdx(i); setTransitioning(false); }, 220);
  }
  function pickTeamNight(id) {
    if (id === teamNight) return;
    setTransitioning(true);
    setTimeout(() => { setTeamNight(id); setTransitioning(false); }, 220);
  }

  const Scene = SCENES[sceneIdx].Comp;

  return (
    <div style={{minHeight:"100vh", overflow:"auto"}} className="scrolly">
      <div style={{
        opacity: transitioning ? 0 : 1,
        transition: "opacity 600ms cubic-bezier(.22,1,.36,1)",
      }} key={sceneIdx + "-" + (teamNight || "x")}>
        <Scene teamNight={teamNight}/>
      </div>

      <SceneSwitcher current={sceneIdx} onChange={switchScene}/>
      <TeamSwitcher current={teamNight} onChange={pickTeamNight}/>

      <button onClick={() => setCmdkOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full"
        style={{
          background: "rgba(20,18,22,0.66)",
          backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.92)",
          boxShadow: "0 8px 28px -6px rgba(0,0,0,0.5)",
        }}>
        <Icon name="search" size={13}/>
        <span className="font-mono text-[11px]">Search anything</span>
        <span className="kbd">⌘K</span>
      </button>

      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)}/>
    </div>
  );
}

function SceneSwitcher({ current, onChange }) {
  return (
    <div className="fixed top-5 right-5 z-40 flex items-center gap-1.5 px-1.5 py-1.5 rounded-full"
         style={{
           background: "rgba(20,18,22,0.6)",
           backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
           border: "1px solid rgba(255,255,255,0.14)",
           boxShadow: "0 10px 30px -8px rgba(0,0,0,0.5)",
         }}>
      {SCENES.map((s, i) => (
        <button key={s.id} onClick={() => onChange(i)}
          className="px-3 py-1.5 rounded-full transition-all duration-300"
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

function TeamSwitcher({ current, onChange }) {
  return (
    <div className="fixed top-5 left-1/2 z-40 flex items-center gap-1 px-1.5 py-1.5 rounded-full"
         style={{
           transform:"translateX(-50%)",
           background: "rgba(20,18,22,0.6)",
           backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
           border: "1px solid rgba(255,255,255,0.14)",
           boxShadow: "0 10px 30px -8px rgba(0,0,0,0.5)",
         }}>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] px-2.5" style={{color:"rgba(255,255,255,0.55)"}}>Match</span>
      {TEAM_NIGHTS.map((t) => (
        <button key={t.id || "default"} onClick={() => onChange(t.id)}
          className="px-3 py-1.5 rounded-full transition-all duration-300"
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

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
