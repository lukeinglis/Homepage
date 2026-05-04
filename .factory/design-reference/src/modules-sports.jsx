// Sports modules — fan command center.

const LG_LABEL = { mlb:"MLB", nfl:"NFL", nba:"NBA", cfb:"CFB", cbb:"CBB", epl:"EPL", ucl:"UCL", pga:"PGA", f1:"F1", tns:"TNS", ufc:"UFC", mls:"MLS", nhl:"NHL" };
const LG_COLOR = { mlb:"#0c2340", nfl:"#013369", nba:"#c8102e", cfb:"#5a2d82", cbb:"#ff6900", epl:"#3d195b", ucl:"#00316f", pga:"#014421", f1:"#e10600", tns:"#b3d335", ufc:"#d20a0a", mls:"#001f5b", nhl:"#101820" };

function LeaguePip({ lg }) {
  return (
    <span style={{display:"inline-flex", alignItems:"center", justifyContent:"center",
      width:22, height:22, borderRadius:6, background: LG_COLOR[lg] || "#444",
      color:"#fff", fontFamily:"var(--mono)", fontSize:9, fontWeight:600, letterSpacing:"0.02em"}}>{LG_LABEL[lg]}</span>
  );
}

function GameRow({ g, dense=false }) {
  const showScore = typeof g.aw === "number";
  const teamish = g.home ? `${g.away} @ ${g.home}` : g.away;
  return (
    <div className={`flex items-center gap-3 ${dense?"py-1.5":"py-2"} px-2 rounded-md tile`} style={{background: g.mine ? "rgba(255,180,80,0.06)" : "transparent"}}>
      <LeaguePip lg={g.lg}/>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <div className="text-[13px] font-medium leading-tight truncate">{teamish}</div>
          {g.mine && <span className="font-mono text-[9px] uppercase tracking-wider" style={{color:"#ffba6e"}}>★ mine</span>}
        </div>
        <div className="text-[11px] text-muted truncate">{g.stakes} · {g.net}</div>
      </div>
      {showScore && (
        <div className="font-mono tabnum text-[14px] font-medium leading-none px-2.5 py-1 rounded hairline" style={{background:"rgba(255,255,255,0.04)"}}>
          {g.aw}–{g.hs}
        </div>
      )}
      <div className="flex items-center gap-1.5 w-[78px] justify-end">
        {g.live && <span className="live-dot"/>}
        <span className="font-mono text-[11px] tabnum">{g.state}</span>
      </div>
    </div>
  );
}

function SportsBoard({ slate="weekday_evening", title="What's on", subtitle, hero=null }) {
  const games = window.GAMES[slate];
  return (
    <div className="module p-5 module-enter" style={{animationDelay:"60ms"}}>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Sports · {title}</div>
          <div className="font-serif text-[22px] leading-tight mt-0.5">{subtitle}</div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-muted">
          <Icon name="tv" size={13}/> on TV now
        </div>
      </div>
      {hero}
      <div className="space-y-1">
        {games.map((g,i)=>(<GameRow key={i} g={g}/>))}
      </div>
      <div className="divider my-3"/>
      <div className="flex items-center justify-between font-mono text-[10.5px] text-muted">
        <div>Tracking · NFL · NBA · MLB · CFB · CBB · EPL · UCL · F1 · PGA · ATP · UFC</div>
        <button className="hover:text-white">All games <Icon name="chevron" size={11}/></button>
      </div>
    </div>
  );
}

// ─── Expanded "My teams" — deep, fan-y treatment ──────────────────────
const MY_TEAMS_DETAIL = [
  {
    abbr:"AUB", name:"Auburn Tigers", sport:"CFB", record:"7-1 (4-1 SEC)",
    cs:["#03244d","#e87722"],
    rank:"#9 AP · #7 CFP",
    next:{ when:"Today 3:30 ET", line:"vs. Georgia", net:"CBS", spread:"+2.5" },
    last:[
      { res:"W", line:"vs. Texas A&M 31-24", note:"OT thriller" },
      { res:"W", line:"@ Vanderbilt 38-10" },
      { res:"L", line:"vs. Alabama 17-24",   note:"Iron Bowl L" },
      { res:"W", line:"vs. Kentucky 27-13" },
      { res:"W", line:"@ Mizzou 21-17" },
    ],
    stat:[ ["Off","32.4 ppg"], ["Def","19.1 ppg"], ["QB","Arnold · 64% · 18 TD"] ],
    badge:"GAMEDAY",
  },
  {
    abbr:"BAL", name:"Baltimore Orioles", sport:"MLB", record:"19-12 (1st AL East)",
    cs:["#df4601","#000000"],
    rank:"AL East — 1.5 GB lead",
    next:{ when:"Tomorrow 7:05 ET", line:"vs. Boston (Bautista vs. Houck)", net:"MASN" },
    last:[
      { res:"W", line:"vs. BOS 6-4", note:"Henderson 2 HR" },
      { res:"W", line:"vs. BOS 3-1" },
      { res:"W", line:"vs. BOS 7-5", note:"Sweep clincher" },
      { res:"L", line:"@ NYY 2-5" },
      { res:"W", line:"@ NYY 4-2" },
    ],
    stat:[ ["Henderson","OPS .932 · 8 HR"], ["Rutschman","OPS .883"], ["Bullpen","ERA 2.84"] ],
    badge:"WIN STREAK +3",
  },
  {
    abbr:"CHE", name:"Chelsea FC", sport:"EPL", record:"18-7-3 (3rd, 57 pts)",
    cs:["#034694","#5fa9e3"],
    rank:"UCL place · 3 pts back of 2nd",
    next:{ when:"Today 12:30 ET", line:"vs. Man City (Stamford Bridge)", net:"USA" },
    last:[
      { res:"W", line:"@ Brighton 2-0" },
      { res:"D", line:"vs. Arsenal 1-1", note:"Palmer 89'" },
      { res:"W", line:"@ Forest 3-1" },
      { res:"W", line:"vs. Spurs 4-3", note:"Derby" },
      { res:"L", line:"@ Liverpool 0-2" },
    ],
    stat:[ ["Palmer","17 G / 11 A"], ["Jackson","12 G"], ["xG diff","+1.4 / match"] ],
    badge:"MATCHDAY",
  },
  {
    abbr:"TB",  name:"Tampa Bay Buccaneers", sport:"NFL", record:"4-3 (2nd NFC South)",
    cs:["#a71930","#322f2b"],
    rank:"In the hunt · NFC South tight",
    next:{ when:"Sun Nov 9 · 1:00 ET", line:"vs. Saints", net:"FOX" },
    last:[
      { res:"W", line:"vs. ATL 31-24" },
      { res:"L", line:"@ DET 17-31" },
      { res:"W", line:"@ NO 26-20" },
    ],
    stat:[ ["Mayfield","2,089 yds · 14 TD"], ["Evans","612 yds · 5 TD"], ["Defense","Sacks 22"] ],
    badge:"BYE WK 9",
  },
  {
    abbr:"MIN", name:"Minnesota Timberwolves", sport:"NBA", record:"WCSF · trail 1-2",
    cs:["#0c2340","#236192"],
    rank:"Down 2-1 vs. Denver",
    next:{ when:"Today 8:30 ET", line:"@ Denver — Game 4", net:"TNT" },
    last:[
      { res:"L", line:"@ DEN 99-110", note:"G3 — Jokić 38" },
      { res:"W", line:"@ DEN 105-100", note:"G2 — Ant 36" },
      { res:"L", line:"@ DEN 90-101", note:"G1" },
    ],
    stat:[ ["Edwards","30.4 / 7.1 / 6.0"], ["Gobert","DPOY runner-up"], ["3PT D","#1 in NBA"] ],
    badge:"MUST WIN",
  },
];

function MyTeamsRail() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"120ms"}}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">My teams · today</div>
        <div className="font-mono text-[10.5px] text-muted">5 followed</div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {MY_TEAMS_DETAIL.map((t,i)=>(
          <div key={i} className="rounded-lg p-2.5 relative overflow-hidden" style={{background: `linear-gradient(135deg, ${t.cs[0]}, ${t.cs[1]})`, color:"#fff"}}>
            <div className="font-mono text-[10px] opacity-75 uppercase tracking-wider">{t.name.split(" ").slice(-1)[0]}</div>
            <div className="font-serif text-[20px] leading-tight">{t.abbr}</div>
            <div className="text-[10.5px] mt-1 font-mono opacity-90">{t.next.line}</div>
            <div className="text-[10px] mt-0.5 font-mono opacity-70">{t.next.when} · {t.next.net}</div>
            <div className="font-mono text-[8.5px] mt-1.5 uppercase tracking-wider opacity-80" style={{color:"#ffe4b5"}}>{t.badge}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamDeepDive({ team }) {
  const t = team || MY_TEAMS_DETAIL[0];
  return (
    <div className="module p-0 overflow-hidden module-enter" style={{animationDelay:"100ms"}}>
      <div className="p-5 relative" style={{background:`linear-gradient(135deg, ${t.cs[0]}, ${t.cs[1]})`, color:"#fff"}}>
        <div className="absolute inset-0 opacity-30" style={{background:"radial-gradient(ellipse at 80% 0%, rgba(255,235,200,0.4), transparent 60%)"}}/>
        <div className="relative">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{color:"rgba(255,235,200,0.85)"}}>{t.sport} · {t.rank}</div>
          <div className="font-serif italic text-[34px] leading-[1.05] mt-1">{t.name}</div>
          <div className="font-mono text-[12px] tabnum mt-1" style={{color:"rgba(255,235,200,0.85)"}}>{t.record}</div>
          <div className="mt-4 hairline rounded-md p-2.5" style={{background:"rgba(0,0,0,0.18)", borderColor:"rgba(255,255,255,0.18)"}}>
            <div className="font-mono text-[10px] uppercase tracking-wider opacity-80">Next up</div>
            <div className="flex items-baseline justify-between mt-0.5">
              <div className="font-medium text-[14px]">{t.next.line}</div>
              <div className="font-mono text-[11px] tabnum opacity-90">{t.next.when} · {t.next.net}{t.next.spread ? " · " + t.next.spread : ""}</div>
            </div>
          </div>
        </div>
      </div>
      {/* form + stats */}
      <div className="grid grid-cols-2 gap-0">
        <div className="p-4 hairline" style={{borderRight:"1px solid rgba(255,255,255,0.08)"}}>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Recent form</div>
          <div className="flex gap-1 mb-2">
            {t.last.slice(0,5).map((g,i)=>(
              <span key={i} className="font-mono text-[10px] w-5 h-5 inline-flex items-center justify-center rounded"
                    style={{background: g.res==="W" ? "rgba(154,213,156,0.18)" : g.res==="D" ? "rgba(247,184,107,0.18)" : "rgba(240,151,140,0.18)",
                            color: g.res==="W" ? "#9ad59c" : g.res==="D" ? "#f7b86b" : "#f0978c"}}>{g.res}</span>
            ))}
          </div>
          <div className="space-y-1 text-[11.5px]">
            {t.last.slice(0,3).map((g,i)=>(
              <div key={i} className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] text-muted w-3">{g.res}</span>
                <span>{g.line}</span>
                {g.note && <span className="text-muted text-[10.5px] italic">{g.note}</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Key stats</div>
          <div className="space-y-1.5 text-[12px]">
            {t.stat.map((s,i)=>(
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

function FantasyModule() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"180ms"}}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Fantasy · all leagues</div>
        <div className="font-mono text-[10.5px] text-muted">5 active</div>
      </div>
      <div className="space-y-2">
        {(window.FANTASY_DEEP || []).map((f,i)=>(
          <div key={i} className="hairline rounded-md p-2.5" style={{background:"rgba(255,255,255,0.03)"}}>
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{f.platform} · {f.sport} · {f.league}</div>
              <span className="chip" style={{background: f.status==="W" ? "rgba(154,213,156,0.15)" : f.status==="L" ? "rgba(240,151,140,0.15)" : "rgba(247,184,107,0.15)",
                                              borderColor: f.status==="W" ? "rgba(154,213,156,0.3)" : f.status==="L" ? "rgba(240,151,140,0.3)" : "rgba(247,184,107,0.3)",
                                              color: f.status==="W" ? "#9ad59c" : f.status==="L" ? "#f0978c" : "#f7b86b"}}>{f.statusLabel}</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <div className="text-[13px] font-medium font-serif italic">{f.team}</div>
              <div className="font-mono tabnum text-[11.5px]">{f.rec}</div>
            </div>
            <div className="text-[11px] text-muted mt-0.5">{f.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventTakeover() {
  return (
    <div className="module p-0 overflow-hidden module-enter" style={{animationDelay:"40ms", background:"linear-gradient(135deg, #0e3b1f 0%, #173d20 60%, #2c6435 100%)", color:"#f4efd8", border:"1px solid rgba(255,235,170,0.2)"}}>
      <div className="p-6 relative">
        <div className="absolute inset-0 opacity-30" style={{background:"radial-gradient(ellipse at 80% 0%, rgba(255,235,170,0.55), transparent 55%)"}}/>
        <div className="absolute right-6 top-6 font-mono text-[10.5px] tracking-[0.18em]" style={{color:"#d6c98a"}}>SUNDAY · APRIL 12</div>
        <div className="relative">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{color:"#d6c98a"}}>Masters Week</div>
          <div className="font-serif italic text-[44px] leading-[1.05] mt-1 max-w-[640px]">
            Augusta on a knife's edge. <span style={{color:"#d6c98a"}}>Scheffler -14, McIlroy two back.</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="chip" style={{background:"rgba(255,235,170,0.16)", borderColor:"rgba(255,235,170,0.3)", color:"#f4efd8"}}><span className="live-dot"/>R3 LIVE on ESPN+</span>
            <span className="chip" style={{background:"rgba(255,235,170,0.10)", borderColor:"rgba(255,235,170,0.22)", color:"#f4efd8"}}>Final round 2:00 ET CBS</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 px-6 py-3 gap-3 hairline" style={{borderColor:"rgba(255,235,170,0.15)", background:"rgba(0,0,0,0.18)"}}>
        {[
          ["1","Scheffler","-14","F"],["2","McIlroy","-12","F"],["T3","Schauffele","-10","F"],
          ["T3","Åberg","-10","F"],["5","Morikawa","-9","F"],["T6","Hovland","-8","F"],
        ].map((r,i)=>(
          <div key={i} className="font-mono text-[11px]" style={{color:"#d6c98a"}}>
            <span className="opacity-70">{r[0]}</span>
            <div className="text-[12px] mt-0.5" style={{color:"#f4efd8", fontFamily:"var(--serif)", fontStyle:"italic"}}>{r[1]}</div>
            <div className="tabnum mt-0.5">{r[2]} <span className="opacity-50">{r[3]}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreRecap() {
  const finals = [
    { lg:"epl", line:"Chelsea 2 — Man City 1", sub:"Palmer brace · Stamford Bridge", mine:true },
    { lg:"mlb", line:"Orioles 6 — Red Sox 4",  sub:"4-game sweep · Henderson 2 HR", mine:true },
    { lg:"cfb", line:"Auburn 24 — Georgia 17", sub:"OT · Iron Bowl tune-up", mine:true },
    { lg:"pga", line:"Masters R3 — Scheffler -14", sub:"Leads McIlroy by 2 entering Sun." },
    { lg:"f1",  line:"Miami GP Q · Verstappen P1", sub:"Norris P2, Leclerc P3" },
  ];
  return (
    <div className="module p-5 module-enter" style={{animationDelay:"60ms"}}>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Today's finals</div>
          <div className="font-serif text-[22px] leading-tight mt-0.5">A good Saturday.</div>
        </div>
      </div>
      <div className="space-y-1">
        {finals.map((f,i)=>(
          <div key={i} className="flex items-center gap-3 py-2 px-2 rounded-md tile" style={{background: f.mine ? "rgba(255,180,80,0.06)" : "transparent"}}>
            <LeaguePip lg={f.lg}/>
            <div className="flex-1">
              <div className="text-[13.5px] font-medium leading-tight">{f.line}</div>
              <div className="text-[11px] text-muted">{f.sub}</div>
            </div>
            {f.mine && <span className="font-mono text-[9.5px] uppercase tracking-wider" style={{color:"#ffba6e"}}>★</span>}
            <span className="font-mono text-[11px] text-muted">FINAL</span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.MY_TEAMS_DETAIL = MY_TEAMS_DETAIL;
Object.assign(window, { SportsBoard, MyTeamsRail, FantasyModule, EventTakeover, ScoreRecap, GameRow, LeaguePip, TeamDeepDive });
