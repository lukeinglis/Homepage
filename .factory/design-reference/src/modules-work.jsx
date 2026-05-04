// Work modules: meeting timeline, projects, inbox, notes, dev shortcuts.

const TYPE_COLORS = {
  team:  "rgba(160,180,255,0.85)",
  "1on1":"rgba(255,180,140,0.95)",
  ext:   "var(--rh)",
  focus: "rgba(140,220,180,0.85)",
  break: "rgba(255,255,255,0.35)",
  open:  "rgba(255,255,255,0.20)",
};
const TYPE_LABEL = { team:"Team", "1on1":"1:1", ext:"External", focus:"Focus", break:"Break", open:"Open" };

function MeetingTimeline({ now="10:18", phase="day" }) {
  // phase: "day" (morning) shows full timeline w/ next highlighted; "evening" shows what closed
  const meetings = window.MEETINGS;
  const nextIdx = phase === "day" ? 2 : meetings.length;
  return (
    <div className="module work-accent p-5 module-enter" style={{animationDelay:"40ms"}}>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Today · {phase==="day" ? "ahead" : "what closed"}</div>
          <div className="font-serif text-[24px] leading-tight mt-0.5">
            {phase==="day" ? "10 meetings, 2 focus blocks" : "9 meetings closed · 1 focus block held"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip"><span className="w-1.5 h-1.5 rounded-full" style={{background:"var(--rh)"}}/>Red Hat</span>
          <span className="font-mono text-[12px] text-muted tabnum">{now}</span>
        </div>
      </div>
      <div className="relative">
        {/* hour rail */}
        <div className="flex font-mono text-[10px] text-muted mb-1.5 tabnum">
          {["08","09","10","11","12","13","14","15","16","17"].map(h=>(
            <div key={h} style={{flex:1}}>{h}</div>
          ))}
        </div>
        <div className="relative h-[68px] rounded-lg hairline overflow-hidden" style={{background:"rgba(255,255,255,0.04)"}}>
          {/* hour ticks */}
          {[...Array(10)].map((_,i)=>(
            <div key={i} style={{position:"absolute", top:0, bottom:0, left: (i*10)+"%", width:"1px", background:"rgba(255,255,255,0.06)"}}/>
          ))}
          {/* meetings */}
          {meetings.map((m, i) => {
            const start = parseTime(m.t) - 8;        // hours from 08:00
            const end   = parseTime(m.end) - 8;
            const left  = (start/9.5)*100;
            const width = ((end-start)/9.5)*100;
            const isNext = i === nextIdx;
            const isPast = phase === "evening" || i < nextIdx;
            return (
              <div key={i} className="absolute top-1.5 bottom-1.5 rounded-md tile" style={{
                left: left+"%", width: `calc(${width}% - 2px)`,
                background: TYPE_COLORS[m.type], opacity: isPast ? 0.42 : (isNext ? 1 : 0.85),
                boxShadow: isNext ? "0 0 0 2px rgba(255,255,255,0.85), 0 0 24px rgba(255,255,255,0.35)" : "none",
                color: m.type==="ext" ? "#fff" : "#1a1410",
                padding: "6px 8px", fontSize: 10.5, fontWeight: 500, lineHeight: 1.15,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
              }} title={m.title}>
                {m.title.replace(/—.*/,"")}
              </div>
            );
          })}
          {/* now line */}
          {phase==="day" && <div style={{position:"absolute", top:-4, bottom:-4, left:`${((parseTime(now)-8)/9.5)*100}%`, width:"2px", background:"#ffffff", boxShadow:"0 0 12px rgba(255,255,255,0.7)"}}/>}
        </div>

        {/* legend */}
        <div className="flex flex-wrap gap-3 mt-3 font-mono text-[10.5px] text-muted">
          {Object.entries(TYPE_LABEL).map(([k,v]) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm" style={{background: TYPE_COLORS[k]}}/>{v}
            </span>
          ))}
        </div>
      </div>

      {phase==="day" && (
        <div className="mt-4 flex items-center justify-between hairline rounded-md px-3 py-2.5" style={{background:"rgba(255,255,255,0.04)"}}>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted">Up next · 10:00</div>
            <div className="text-[14.5px] font-medium leading-tight mt-0.5">1:1 with Priya · Inference EM</div>
          </div>
          <button className="font-mono text-[11px] px-3 py-1.5 rounded-md" style={{background:"var(--rh)", color:"#fff"}}>
            Join Meet ↗
          </button>
        </div>
      )}
      {phase==="evening" && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
          <div className="hairline rounded-md px-3 py-2"><div className="text-muted text-[10.5px] font-mono uppercase tracking-wider">Tomorrow 1st</div><div className="font-medium mt-0.5">Standup · 08:30</div></div>
          <div className="hairline rounded-md px-3 py-2"><div className="text-muted text-[10.5px] font-mono uppercase tracking-wider">Heads-up</div><div className="font-medium mt-0.5">Council pre-read by 9</div></div>
          <div className="hairline rounded-md px-3 py-2"><div className="text-muted text-[10.5px] font-mono uppercase tracking-wider">Free time</div><div className="font-medium mt-0.5">2h 15m · 13:00–15:15</div></div>
        </div>
      )}
    </div>
  );
}
function parseTime(s){ const [h,m] = s.split(":").map(Number); return h + m/60; }

function ProjectsModule() {
  const colors = { "On track":"#9ad59c", "At risk":"#f7b86b", "Discovery":"#9bb8ff" };
  return (
    <div className="module work-accent p-5 module-enter" style={{animationDelay:"120ms"}}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Active workstreams</div>
        <div className="font-mono text-[10.5px] text-muted">4 of 11</div>
      </div>
      <div className="space-y-3">
        {window.PROJECTS.map((p,i)=>(
          <div key={i} className="hairline rounded-md p-3" style={{background:"rgba(255,255,255,0.03)"}}>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="text-[13.5px] font-medium leading-tight">{p.name}</div>
              <div className="font-mono text-[10.5px] text-muted">{p.last}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[3px] rounded-full" style={{background:"rgba(255,255,255,0.10)"}}>
                <div className="h-full rounded-full" style={{width: p.pct+"%", background: colors[p.status]}}/>
              </div>
              <div className="font-mono text-[10.5px] tabnum w-[36px] text-right">{p.pct}%</div>
              <div className="chip" style={{background:`color-mix(in oklch, ${colors[p.status]} 18%, transparent)`, borderColor:`color-mix(in oklch, ${colors[p.status]} 30%, transparent)`}}>{p.status}</div>
            </div>
            <div className="font-mono text-[10.5px] text-muted mt-1.5">{p.tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InboxModule({ compact=false }) {
  const I = window.INBOX;
  return (
    <div className={`module ${compact?"":"work-accent"} p-4 module-enter`} style={{animationDelay:"80ms"}}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="mail" size={14}/>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">Work inbox</div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10.5px]">
          <span className="chip">{I.unread} unread</span>
          <span className="chip" style={{background:"rgba(255,80,80,0.14)", borderColor:"rgba(255,80,80,0.3)", color:"#ffb0a8"}}>{I.flagged} urgent</span>
        </div>
      </div>
      <div className="space-y-2">
        {I.top.map((m,i)=>(
          <div key={i} className="flex items-baseline gap-3">
            <div className="font-mono text-[10.5px] text-muted tabnum w-[40px]">{m.when}</div>
            <div className="text-[12.5px] font-medium w-[120px] truncate">{m.from}</div>
            <div className="text-[12.5px] text-muted truncate flex-1">{m.subj}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesModule() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"160ms"}}>
      <div className="flex items-center gap-2 mb-3">
        <Icon name="obsidian" size={14}/>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">Obsidian · recent</div>
      </div>
      <div className="space-y-2">
        {window.NOTES.map((n,i)=>(
          <div key={i} className="flex items-center justify-between text-[12.5px]">
            <div className="truncate">{n.title}</div>
            <div className="font-mono text-[10.5px] text-muted">{n.ago}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DevQuicklaunch() {
  const tools = [
    { name: "Claude",   icon: "claude" },
    { name: "ChatGPT",  icon: "sparkles" },
    { name: "GitHub",   icon: "github" },
    { name: "Granite",  icon: "wand" },
    { name: "Terminal", icon: "command" },
    { name: "Jira",     icon: "jira" },
  ];
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"200ms"}}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">LLM · Dev</div>
        <div className="font-mono text-[10.5px] text-muted">⌘K to search</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tools.map(t=>(
          <button key={t.name} className="tile hairline rounded-md py-2.5 flex flex-col items-center gap-1.5" style={{background:"rgba(255,255,255,0.03)"}}>
            <Icon name={t.icon} size={16}/>
            <div className="font-mono text-[10.5px]">{t.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function WorkShortcuts() {
  const apps = [
    { n:"Gmail", i:"mail" }, { n:"Cal", i:"calendar" }, { n:"Drive", i:"doc" },
    { n:"Docs", i:"doc" }, { n:"Slides", i:"slide" }, { n:"Sheets", i:"sheet" },
    { n:"Slack", i:"slack" }, { n:"Confl.", i:"bookmark" },
  ];
  return (
    <div className="module p-3 module-enter" style={{animationDelay:"240ms"}}>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] mb-2 px-1">Workspace</div>
      <div className="grid grid-cols-4 gap-1.5">
        {apps.map(a=>(
          <button key={a.n} className="tile hairline rounded-md py-2 flex flex-col items-center gap-1" style={{background:"rgba(255,255,255,0.03)"}}>
            <Icon name={a.i} size={14}/>
            <div className="font-mono text-[10px]">{a.n}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RedHatNews() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"280ms"}}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-2 h-2 rounded-full" style={{background:"var(--rh)"}}/>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">Red Hat · internal</div>
      </div>
      <ul className="space-y-1.5 text-[12.5px]">
        <li>RHEL AI 1.5 GA freeze · Friday EOD</li>
        <li>Q3 OKR draft circulated to Naren's staff</li>
        <li>Summit: ticket allocations released</li>
      </ul>
    </div>
  );
}

Object.assign(window, { MeetingTimeline, ProjectsModule, InboxModule, NotesModule, DevQuicklaunch, WorkShortcuts, RedHatNews });
