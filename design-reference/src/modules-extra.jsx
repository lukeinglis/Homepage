// New modules: split calendars, embedded YouTube, deeper streaming.

function WorkCalendar({ phase="day", now="08:18" }) {
  // Compact, visual; the timeline lives in MeetingTimeline (work-coded).
  const meetings = window.MEETINGS;
  return (
    <div className="module work-accent p-4 module-enter" style={{animationDelay:"60ms"}}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{background:"var(--rh)"}}/>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">Work calendar · Red Hat</div>
        </div>
        <div className="font-mono text-[10.5px] text-muted">{phase==="day" ? "10 events" : "2 left"}</div>
      </div>
      <div className="space-y-1.5">
        {(phase==="day" ? meetings.slice(0,5) : meetings.slice(-2)).map((m,i)=>(
          <div key={i} className="flex items-baseline gap-3 text-[12.5px]">
            <span className="font-mono tabnum text-muted text-[11px] w-[44px]">{m.t}</span>
            <span className="w-1.5 h-1.5 rounded-full mt-1" style={{background: m.type==="ext" ? "var(--rh)" : m.type==="focus" ? "#9ad59c" : m.type==="1on1" ? "#f7b86b" : "rgba(180,200,255,0.85)"}}/>
            <span className="flex-1 truncate font-medium">{m.title}</span>
            {m.join && <span className="font-mono text-[10px] text-muted">join ↗</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalCalendar({ scene }) {
  // Personal events vary by scene — show what matters now.
  const items = {
    "wkdy_am":[
      { t:"7:00 AM", what:"Run · Esplanade loop · 4 mi" },
      { t:"6:45 PM", what:"Pickup — Lina from soccer" },
      { t:"9:30 PM", what:"Call mom" },
    ],
    "wkdy_pm":[
      { t:"6:45 PM", what:"Pickup — Lina from soccer" },
      { t:"9:00 PM", what:"Wolves @ Nuggets · TNT" },
      { t:"9:30 PM", what:"Call mom" },
    ],
    "wknd_am":[
      { t:"10:00 AM", what:"Farmers market · Copley" },
      { t:"12:30 PM", what:"Chelsea v Man City · USA" },
      { t:"3:30 PM",  what:"Auburn at Georgia · CBS" },
      { t:"7:00 PM",  what:"Drinks · Dave + Sam" },
    ],
    "wknd_pm":[
      { t:"7:30 PM",  what:"Dinner home · short ribs · friends over" },
      { t:"10:00 PM", what:"UFC 322 main · ESPN+ PPV" },
    ],
  }[scene];
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"100ms"}}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{background:"#9ad59c"}}/>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">Personal · life</div>
        </div>
        <div className="font-mono text-[10.5px] text-muted">{items.length} on deck</div>
      </div>
      <div className="space-y-2">
        {items.map((m,i)=>(
          <div key={i} className="flex items-baseline gap-3 text-[12.5px]">
            <span className="font-mono tabnum text-muted text-[11px] w-[60px] flex-none">{m.t}</span>
            <span className="font-serif">{m.what}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── YouTube frame (mock player — feels like the embed) ───────────────
function YouTubeFrame({ video, sub="Watch while cooking", aspect="16/9" }) {
  // video: { title, channel, ch_handle, durTotal, durElapsed, viewers, thumb }
  const v = video || {
    title: "Kenji — The science of braising, in 12 minutes",
    channel: "J. Kenji López-Alt", ch_handle: "@JKenjiLopezAlt",
    durTotal: "12:04", durElapsed: "3:18", viewers: "1.2M views",
    thumb: "linear-gradient(135deg, #4a2a18 0%, #1a0904 50%, #b35c2a 100%)",
  };
  return (
    <div className="module p-0 overflow-hidden module-enter" style={{animationDelay:"60ms"}}>
      <div style={{aspectRatio: aspect, background: v.thumb, position:"relative"}}>
        {/* faux video painterly haze */}
        <div className="absolute inset-0" style={{background:"radial-gradient(circle at 30% 35%, rgba(255,200,140,0.45), transparent 60%)"}}/>
        <div className="absolute inset-0" style={{background:"linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55))"}}/>
        {/* center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full flex items-center justify-center" style={{
            width:64, height:64, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)",
            border:"1px solid rgba(255,255,255,0.2)"}}>
            <Icon name="play" size={26}/>
          </div>
        </div>
        {/* duration tag */}
        <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.18em] flex items-center gap-1.5" style={{color:"#fff"}}>
          <span className="live-dot" style={{background:"#ff3b3b"}}/>
          <span style={{background:"rgba(0,0,0,0.55)", padding:"2px 6px", borderRadius:4}}>YouTube · embed</span>
        </div>
        <div className="absolute top-3 right-3 font-mono text-[10px]" style={{color:"#fff", background:"rgba(0,0,0,0.55)", padding:"2px 6px", borderRadius:4}}>{v.durTotal}</div>
        {/* faux progress */}
        <div className="absolute left-0 right-0 bottom-0">
          <div className="h-[3px] mx-3 mb-2 rounded" style={{background:"rgba(255,255,255,0.18)"}}>
            <div style={{width: "27%", height:"100%", background:"#ff3b3b", borderRadius:2}}/>
          </div>
          <div className="px-3 pb-3 flex items-center justify-between text-[10px] font-mono" style={{color:"rgba(255,255,255,0.85)"}}>
            <span className="tabnum">{v.durElapsed} / {v.durTotal}</span>
            <span className="flex items-center gap-2">
              <Icon name="pause" size={12}/>
              <Icon name="skip" size={12}/>
              <span className="tabnum">{v.viewers}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="p-3.5">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-1">{sub}</div>
        <div className="font-serif text-[16px] leading-tight">{v.title}</div>
        <div className="font-mono text-[10.5px] text-muted mt-1.5 flex items-center gap-2">
          <span className="w-4 h-4 rounded-full inline-block" style={{background:"linear-gradient(135deg,#5a2616,#a4533c)"}}/>
          <span>{v.channel} · {v.ch_handle}</span>
        </div>
      </div>
    </div>
  );
}

function YouTubeQueue({ scene="wkdy_pm" }) {
  const queue = scene.startsWith("wknd")
    ? [
        { t:"NFL RedZone · Sunday Funday cuts",        ch:"NFL", dur:"24:11" },
        { t:"Tifo · How Chelsea won the Champions League by accident", ch:"Tifo Football", dur:"18:34" },
        { t:"Jomboy · Orioles take 4 in a row, sweet swing breakdown", ch:"Jomboy Media", dur:"10:08" },
        { t:"Sara Tanaka · Spring grilling — five sauces, one chicken", ch:"NYT Cooking", dur:"14:02" },
        { t:"Drive to Survive · S7 trailer reaction",  ch:"WTF1", dur:"9:48" },
      ]
    : [
        { t:"Why polenta is better than mash",          ch:"Ethan Chlebowski",   dur:"9:41" },
        { t:"Sunday gravy, Tuesday energy",             ch:"Adam Ragusea",       dur:"14:27" },
        { t:"Ten-minute weeknight ramen, three ways",   ch:"Made With Lau",      dur:"11:50" },
      ];
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"160ms"}}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="video" size={14}/>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">YouTube · queue</div>
        </div>
        <button className="font-mono text-[10.5px] text-muted">All ↗</button>
      </div>
      <div className="space-y-2.5">
        {queue.map((v,i)=>(
          <div key={i} className="flex gap-3">
            <div className="w-[68px] h-[40px] rounded flex-none relative overflow-hidden"
                 style={{background: i===0 ? "linear-gradient(135deg,#1a3a2a,#06120a)"
                                   : i===1 ? "linear-gradient(135deg,#0a2a4e,#02080f)"
                                   : i===2 ? "linear-gradient(135deg,#3a1f10,#0c0604)"
                                   : i===3 ? "linear-gradient(135deg,#3e2a18,#0e0604)"
                                   :         "linear-gradient(135deg,#3a1010,#0a0000)"}}>
              <div className="absolute inset-0 flex items-center justify-center"><Icon name="play" size={14}/></div>
              <div className="absolute right-1 bottom-0.5 font-mono text-[8.5px]" style={{color:"#fff", background:"rgba(0,0,0,0.7)", padding:"1px 3px", borderRadius:2}}>{v.dur}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium leading-tight">{v.t}</div>
              <div className="font-mono text-[10.5px] text-muted mt-0.5">{v.ch}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreamingShelf({ scene="wknd_pm" }) {
  // Big, image-driven shelf — cinematic for evening scenes.
  const rows = scene === "wknd_pm" ? [
    { row:"Continue watching", items:[
      { t:"Severance — S3E2",       svc:"Apple TV+", left:"47m left",  bg:"linear-gradient(180deg,#0a2230,#040b10)", new:true },
      { t:"Slow Horses — S5E1",     svc:"Apple TV+", left:"new",       bg:"linear-gradient(180deg,#1a2030,#06080f)", new:true },
      { t:"Industry — S4E3",        svc:"HBO Max",   left:"S4E3",      bg:"linear-gradient(180deg,#3a0a0a,#100404)" },
      { t:"Ripley",                 svc:"Netflix",   left:"3 episodes", bg:"linear-gradient(180deg,#1a1a2e,#070710)" },
    ]},
    { row:"Sports tonight on streaming", items:[
      { t:"Wolves @ Nuggets G4",    svc:"TNT · Max", left:"8:30 ET",   bg:"linear-gradient(180deg,#0c2340,#236192)", live:true },
      { t:"UFC 322 PPV",            svc:"ESPN+",     left:"10:00 ET",  bg:"linear-gradient(180deg,#3a0606,#0e0202)" },
      { t:"MLS · Galaxy v LAFC",    svc:"Apple TV",  left:"10:30 ET",  bg:"linear-gradient(180deg,#1a1a1a,#000000)" },
      { t:"F1 Miami · qualifying",  svc:"F1 TV",     left:"recap",     bg:"linear-gradient(180deg,#3a0606,#100000)" },
    ]},
  ] : [
    { row:"Tonight's pick", items:[
      { t:"Severance — S3E2",       svc:"Apple TV+", left:"47m left",  bg:"linear-gradient(180deg,#0a2230,#040b10)", new:true },
      { t:"Slow Horses — S5E1",     svc:"Apple TV+", left:"new",       bg:"linear-gradient(180deg,#1a2030,#06080f)", new:true },
      { t:"Industry — S4E3",        svc:"HBO Max",   left:"S4E3",      bg:"linear-gradient(180deg,#3a0a0a,#100404)" },
      { t:"Ripley",                 svc:"Netflix",   left:"3 episodes", bg:"linear-gradient(180deg,#1a1a2e,#070710)" },
    ]},
  ];
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"180ms"}}>
      <div className="flex items-center gap-2 mb-3">
        <Icon name="tv" size={14}/>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">Streaming</div>
      </div>
      <div className="space-y-4">
        {rows.map((r,ri)=>(
          <div key={ri}>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">{r.row}</div>
            <div className="grid grid-cols-4 gap-2">
              {r.items.map((it,i)=>(
                <div key={i} className="rounded-lg overflow-hidden tile hairline">
                  <div className="aspect-[3/4] relative" style={{background: it.bg}}>
                    {it.live && <div className="absolute top-2 left-2"><span className="chip" style={{background:"rgba(255,59,59,0.18)", borderColor:"rgba(255,59,59,0.4)", color:"#ffb0a8"}}><span className="live-dot"/>LIVE</span></div>}
                    {it.new && !it.live && <div className="absolute top-2 left-2"><span className="chip" style={{background:"rgba(122,223,255,0.16)", borderColor:"rgba(122,223,255,0.3)", color:"#bdeaff"}}>NEW</span></div>}
                    <div className="absolute inset-x-0 bottom-0 p-2.5" style={{background:"linear-gradient(180deg, transparent, rgba(0,0,0,0.7))"}}>
                      <div className="text-[12px] font-medium leading-tight font-serif">{it.t}</div>
                      <div className="font-mono text-[9.5px] text-muted mt-0.5 flex justify-between"><span>{it.svc}</span><span>{it.left}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { WorkCalendar, PersonalCalendar, YouTubeFrame, YouTubeQueue, StreamingShelf });
