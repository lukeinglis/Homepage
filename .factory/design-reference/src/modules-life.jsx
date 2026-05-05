// Life modules: greeting, weather, markets, finance, news, music, watch, shopping, social, quote.

// City detection — uses browser geolocation + reverse-geocode (open-meteo, no key).
// Falls back to Boston if denied/unavailable. Result cached in localStorage.
function useDetectedCity(fallback="Boston") {
  const [city, setCity] = React.useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem("homepage_city") || "null");
      if (cached && cached.name && (Date.now() - cached.t) < 1000*60*60*24) return cached.name;
    } catch {}
    return fallback;
  });
  const [status, setStatus] = React.useState("cached"); // cached | detecting | live | denied | error

  React.useEffect(() => {
    if (!navigator.geolocation) return;
    setStatus("detecting");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude:lat, longitude:lon } = pos.coords;
          const r = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`);
          const j = await r.json();
          const place = j?.results?.[0];
          const name = place?.name || place?.admin2 || place?.admin1 || fallback;
          setCity(name);
          setStatus("live");
          try { localStorage.setItem("homepage_city", JSON.stringify({ name, t: Date.now() })); } catch {}
        } catch { setStatus("error"); }
      },
      () => setStatus("denied"),
      { timeout: 5000, maximumAge: 1000*60*60 }
    );
  }, []);

  return { city, status };
}

function Greeting({ scene, name="Luke" }) {
  const { city, status } = useDetectedCity("Boston");
  const dt = {
    "wkdy_am": { greet:"Good morning, "+name+".", sub:"Calm Tuesday over the Charles. Three deep blocks scheduled.", date:"Tuesday · May 5" },
    "wkdy_pm": { greet:"Easy into the evening, "+name+".", sub:"Boston's hung out the lights. Polenta on at six.", date:"Tuesday · May 5" },
    "wknd_am": { greet:"Saturday's wide open, "+name+".", sub:"Auburn at 3:30. Masters from now until late.", date:"Saturday · April 12" },
    "wknd_pm": { greet:"Settle in, "+name+".", sub:"Wolves at 8:30. Short ribs already on.", date:"Saturday · April 12" },
  }[scene];
  const time = {
    "wkdy_am":"7:42",
    "wkdy_pm":"6:18",
    "wknd_am":"9:14",
    "wknd_pm":"7:52",
  }[scene];
  const ampm = scene.endsWith("_am") ? "AM" : "PM";

  return (
    <div className="module-enter" style={{animationDelay:"0ms"}}>
      <div className="flex items-baseline gap-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{dt.date}</div>
        <div className="font-mono text-[11px] tabnum text-muted flex items-center gap-1.5">
          <span>{time} {ampm} · {city}</span>
          <span title={
            status==="live"      ? "Detected from your location" :
            status==="detecting" ? "Detecting location…" :
            status==="denied"    ? "Location denied — using last known" :
            status==="cached"    ? "Last detected location" :
                                   "Default location"
          } style={{
            display:"inline-block", width:5, height:5, borderRadius:99,
            background: status==="live" ? "#9ad59c" : status==="detecting" ? "#f7b86b" : "rgba(255,255,255,0.4)",
            boxShadow: status==="live" ? "0 0 8px rgba(154,213,156,0.8)" : "none",
            animation: status==="detecting" ? "pulseslow 1.4s ease-in-out infinite" : "none",
          }}/>
        </div>
      </div>
      <div className="font-serif text-[56px] leading-[1.02] mt-2 max-w-[860px]" style={{letterSpacing:"-0.012em"}}>
        {dt.greet} <span className="italic" style={{opacity:0.78}}>{dt.sub}</span>
      </div>
    </div>
  );
}

function WeatherModule({ scene }) {
  const w = {
    "wkdy_am": window.WEATHER.morning,
    "wkdy_pm": window.WEATHER.evening,
    "wknd_am": window.WEATHER.wknd_am,
    "wknd_pm": window.WEATHER.wknd_pm,
  }[scene];
  const hours = scene.endsWith("_am")
    ? [["6a",54],["8a",58],["10a",62],["12p",66],["2p",70],["4p",69],["6p",65],["8p",60]]
    : [["12p",66],["2p",70],["4p",69],["6p",65],["8p",60],["10p",56],["12a",53],["2a",51]];
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"60ms"}}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><Icon name={w.icon} size={14}/><div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">{w.city}</div></div>
        <div className="font-mono text-[10.5px] text-muted">{w.cond}</div>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="font-serif text-[44px] leading-none tabnum">{w.t}°</div>
        <div className="font-mono text-[11px] text-muted tabnum">{w.lo}° · {w.hi}°</div>
      </div>
      <div className="mt-3 flex items-end gap-1.5 h-[42px]">
        {hours.map((h,i)=>{
          const pct = (h[1]-48)/26;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-sm" style={{height:`${pct*100}%`, minHeight:6, background:"linear-gradient(180deg, rgba(255,180,120,0.85), rgba(255,180,120,0.25))"}}/>
              <div className="font-mono text-[9px] text-muted tabnum">{h[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarketsModule({ phase="open" }) {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"100ms"}}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">Markets · {phase==="open" ? "pre-open" : "after-hours"}</div>
        <div className="font-mono text-[10.5px] text-muted">{phase==="open" ? "9:30 ET in 1h 48m" : "Closed at 4:00 ET"}</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {window.MARKETS.map((m,i)=>(
          <div key={i} className="hairline rounded-md p-2.5" style={{background:"rgba(255,255,255,0.03)"}}>
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{m.sym}</div>
              <div className={`font-mono text-[10.5px] tabnum ${m.up?"":"text-muted"}`} style={{color: m.up ? "#9ad59c" : "#f0978c"}}>{m.chg}</div>
            </div>
            <div className="flex items-baseline justify-between mt-0.5">
              <div className="font-serif text-[18px] tabnum">{m.val}</div>
              <Sparkline values={m.spark} up={m.up}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Sparkline({ values, up }) {
  const w = 60, h = 22;
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v,i)=>[ (i/(values.length-1))*w, h - ((v-min)/(max-min||1))*h ]);
  const d = pts.map((p,i)=> (i?"L":"M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return (
    <svg width={w} height={h}><path d={d} className="spark" stroke={up ? "#9ad59c" : "#f0978c"} strokeWidth="1.4"/></svg>
  );
}

function NetWorthModule() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"140ms"}}>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted mb-1">Net worth · glance</div>
      <div className="font-serif text-[28px] leading-none tabnum mt-1">{window.NETWORTH.total}</div>
      <div className="font-mono text-[10.5px] mt-1" style={{color:"#9ad59c"}}>{window.NETWORTH.delta}</div>
      <div className="divider my-3"/>
      <div className="space-y-1.5 text-[12px]">
        <div className="flex justify-between"><span className="text-muted">Brokerage</span><span className="font-mono tabnum">$268.4k</span></div>
        <div className="flex justify-between"><span className="text-muted">401(k)</span><span className="font-mono tabnum">$184.2k</span></div>
        <div className="flex justify-between"><span className="text-muted">Cash</span><span className="font-mono tabnum">$34.6k</span></div>
      </div>
    </div>
  );
}

function NewsModule({ feeds=["bloomberg","hn"], hero=null }) {
  const labels = { bloomberg:"Bloomberg", hn:"Hacker News", nyt:"NYT", espn:"ESPN", cnn:"CNN" };
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"160ms"}}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">News · curated</div>
        <div className="flex gap-1">{feeds.map(f=><span key={f} className="chip">{labels[f]}</span>)}</div>
      </div>
      {hero && <div className="font-serif text-[18px] leading-tight mb-3">{hero}</div>}
      <div className="space-y-3">
        {feeds.map(f=>(
          <div key={f}>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1.5">{labels[f]}</div>
            <ul className="space-y-1.5">
              {window.NEWS[f].map((h,i)=>(
                <li key={i} className="text-[12.5px] leading-snug">{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function NowPlaying() {
  const np = window.NOW_PLAYING;
  return (
    <div className="module p-3 module-enter" style={{animationDelay:"200ms"}}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded flex-none relative overflow-hidden" style={{background: np.cover}}>
          <div className="absolute inset-0" style={{boxShadow:"inset 0 0 18px rgba(0,0,0,0.4)"}}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted flex items-center gap-1.5"><span className="live-dot" style={{background:"#7adfff"}}/>Now playing · {np.source}</div>
          <div className="text-[13px] font-medium font-serif italic leading-tight mt-0.5 truncate">{np.title}</div>
          <div className="font-mono text-[10.5px] text-muted truncate">{np.artist}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hairline rounded-full w-7 h-7 flex items-center justify-center"><Icon name="pause" size={12}/></button>
          <button className="hairline rounded-full w-7 h-7 flex items-center justify-center"><Icon name="skip" size={12}/></button>
        </div>
      </div>
    </div>
  );
}

function WatchlistModule() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"220ms"}}>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted mb-3">Watch · queued</div>
      <div className="space-y-2">
        {window.WATCHLIST.map((w,i)=>(
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-14 rounded flex-none" style={{background: i===0 ? "linear-gradient(180deg,#0a2230,#040b10)" : i===1 ? "linear-gradient(180deg,#3a0a0a,#100404)" : i===2 ? "linear-gradient(180deg,#1a1a2e,#070710)" : "linear-gradient(180deg,#2a1830,#0a0414)"}}/>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium leading-tight truncate font-serif">{w.title}</div>
              <div className="font-mono text-[10.5px] text-muted">{w.svc} · {w.left}</div>
            </div>
            {w.new && <span className="chip" style={{background:"rgba(122,223,255,0.16)", borderColor:"rgba(122,223,255,0.3)", color:"#bdeaff"}}>new</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShoppingModule() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"240ms"}}>
      <div className="flex items-center gap-2 mb-3"><Icon name="shopping" size={14}/><div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">Cart · wishlist</div></div>
      <div className="space-y-2">
        {window.SHOP.map((s,i)=>(
          <div key={i} className="text-[12.5px]">
            <div className="font-serif">{s.what}</div>
            <div className="font-mono text-[10.5px] text-muted">{s.at} · {s.state}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteModule({ idx=0 }) {
  const q = window.QUOTES[idx];
  return (
    <div className="module-enter" style={{animationDelay:"300ms"}}>
      <div className="font-serif italic text-[16px] leading-snug" style={{maxWidth: 320, opacity: 0.78}}>"{q.q}" <span className="font-mono text-[10.5px] not-italic text-muted">{q.w}</span></div>
    </div>
  );
}

function PinnedRow({ pins=[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {pins.map((p,i)=>(
        <button key={i} className="tile hairline rounded-md px-2.5 py-1.5 flex items-center gap-1.5" style={{background:"rgba(255,255,255,0.03)"}}>
          <Icon name={p.i} size={12}/>
          <span className="font-mono text-[11px]">{p.n}</span>
        </button>
      ))}
    </div>
  );
}

function PersonalCal() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"180ms"}}>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted mb-2">Personal</div>
      <div className="space-y-2 text-[12.5px]">
        <div className="flex gap-3"><span className="font-mono tabnum text-muted w-[44px]">7:00p</span><span>Pickup — Lina from soccer</span></div>
        <div className="flex gap-3"><span className="font-mono tabnum text-muted w-[44px]">9:30p</span><span className="font-serif italic">Call mom</span></div>
      </div>
    </div>
  );
}

Object.assign(window, { Greeting, WeatherModule, MarketsModule, NetWorthModule, NewsModule, NowPlaying, WatchlistModule, ShoppingModule, QuoteModule, PinnedRow, PersonalCal });
