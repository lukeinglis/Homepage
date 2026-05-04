import { Icon } from '../scenes/Icons';
import { MEETINGS, PROJECTS, INBOX, NOTES } from '../../data/scene-data';
import type { Meeting } from '../../data/scene-data';

const TYPE_COLORS: Record<string, string> = {
  team: "rgba(160,180,255,0.85)",
  "1on1": "rgba(255,180,140,0.95)",
  ext: "var(--rh)",
  focus: "rgba(140,220,180,0.85)",
  break: "rgba(255,255,255,0.35)",
  open: "rgba(255,255,255,0.20)",
};
const TYPE_LABEL: Record<string, string> = { team: "Team", "1on1": "1:1", ext: "External", focus: "Focus", break: "Break", open: "Open" };

function parseTime(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h + m / 60;
}

export function MeetingTimeline({ now = "10:18", phase = "day" }: { now?: string; phase?: string }) {
  const meetings = MEETINGS;
  const nextIdx = phase === "day" ? 2 : meetings.length;
  return (
    <div className="module work-accent p-5 module-enter" style={{ animationDelay: "40ms" }}>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="font-mono uppercase text-muted" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Today · {phase === "day" ? "ahead" : "what closed"}</div>
          <div className="font-serif leading-tight mt-0.5" style={{ fontSize: "24px" }}>
            {phase === "day" ? "10 meetings, 2 focus blocks" : "9 meetings closed · 1 focus block held"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip"><span className="rounded-full" style={{ width: 6, height: 6, background: "var(--rh)" }} />Red Hat</span>
          <span className="font-mono text-muted tabnum" style={{ fontSize: "12px" }}>{now}</span>
        </div>
      </div>
      <div className="relative">
        <div className="flex font-mono text-muted mb-1.5 tabnum" style={{ fontSize: "10px" }}>
          {["08", "09", "10", "11", "12", "13", "14", "15", "16", "17"].map(h => (
            <div key={h} style={{ flex: 1 }}>{h}</div>
          ))}
        </div>
        <div className="relative rounded-lg hairline overflow-hidden" style={{ height: 68, background: "rgba(255,255,255,0.04)" }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: (i * 10) + "%", width: "1px", background: "rgba(255,255,255,0.06)" }} />
          ))}
          {meetings.map((m: Meeting, i: number) => {
            const start = parseTime(m.t) - 8;
            const end = parseTime(m.end) - 8;
            const left = (start / 9.5) * 100;
            const width = ((end - start) / 9.5) * 100;
            const isNext = i === nextIdx;
            const isPast = phase === "evening" || i < nextIdx;
            return (
              <div key={i} className="absolute rounded-md tile" style={{
                top: 6, bottom: 6,
                left: left + "%", width: `calc(${width}% - 2px)`,
                background: TYPE_COLORS[m.type], opacity: isPast ? 0.42 : (isNext ? 1 : 0.85),
                boxShadow: isNext ? "0 0 0 2px rgba(255,255,255,0.85), 0 0 24px rgba(255,255,255,0.35)" : "none",
                color: m.type === "ext" ? "#fff" : "#1a1410",
                padding: "6px 8px", fontSize: 10.5, fontWeight: 500, lineHeight: 1.15,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }} title={m.title}>
                {m.title.replace(/—.*/, "")}
              </div>
            );
          })}
          {phase === "day" && <div style={{ position: "absolute", top: -4, bottom: -4, left: `${((parseTime(now) - 8) / 9.5) * 100}%`, width: "2px", background: "#ffffff", boxShadow: "0 0 12px rgba(255,255,255,0.7)" }} />}
        </div>
        <div className="flex flex-wrap gap-3 mt-3 font-mono text-muted" style={{ fontSize: "10.5px" }}>
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className="rounded-sm" style={{ width: 8, height: 8, background: TYPE_COLORS[k] }} />{v}
            </span>
          ))}
        </div>
      </div>
      {phase === "day" && (
        <div className="mt-4 flex items-center justify-between hairline rounded-md px-3 py-2.5" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div>
            <div className="font-mono uppercase text-muted" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>Up next · 10:00</div>
            <div className="font-medium leading-tight mt-0.5" style={{ fontSize: "14.5px" }}>1:1 with Priya · Inference EM</div>
          </div>
          <button className="font-mono rounded-md" style={{ fontSize: "11px", padding: "6px 12px", background: "var(--rh)", color: "#fff" }}>
            Join Meet ↗
          </button>
        </div>
      )}
      {phase === "evening" && (
        <div className="mt-4 grid grid-cols-3 gap-2" style={{ fontSize: "12px" }}>
          <div className="hairline rounded-md px-3 py-2"><div className="text-muted font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.05em" }}>Tomorrow 1st</div><div className="font-medium mt-0.5">Standup · 08:30</div></div>
          <div className="hairline rounded-md px-3 py-2"><div className="text-muted font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.05em" }}>Heads-up</div><div className="font-medium mt-0.5">Council pre-read by 9</div></div>
          <div className="hairline rounded-md px-3 py-2"><div className="text-muted font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.05em" }}>Free time</div><div className="font-medium mt-0.5">2h 15m · 13:00–15:15</div></div>
        </div>
      )}
    </div>
  );
}

export function ProjectsModule() {
  const colors: Record<string, string> = { "On track": "#9ad59c", "At risk": "#f7b86b", "Discovery": "#9bb8ff" };
  return (
    <div className="module work-accent p-5 module-enter" style={{ animationDelay: "120ms" }}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-mono uppercase text-muted" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Active workstreams</div>
        <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>4 of 11</div>
      </div>
      <div className="space-y-3">
        {PROJECTS.map((p, i) => (
          <div key={i} className="hairline rounded-md p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="font-medium leading-tight" style={{ fontSize: "13.5px" }}>{p.name}</div>
              <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>{p.last}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-full" style={{ height: 3, background: "rgba(255,255,255,0.10)" }}>
                <div className="rounded-full" style={{ height: "100%", width: p.pct + "%", background: colors[p.status] }} />
              </div>
              <div className="font-mono tabnum text-right" style={{ fontSize: "10.5px", width: 36 }}>{p.pct}%</div>
              <div className="chip" style={{ background: `color-mix(in oklch, ${colors[p.status]} 18%, transparent)`, borderColor: `color-mix(in oklch, ${colors[p.status]} 30%, transparent)` }}>{p.status}</div>
            </div>
            <div className="font-mono text-muted mt-1.5" style={{ fontSize: "10.5px" }}>{p.tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InboxModule({ compact = false }: { compact?: boolean }) {
  const I = INBOX;
  return (
    <div className={`module ${compact ? "" : "work-accent"} p-4 module-enter`} style={{ animationDelay: "80ms" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="mail" size={14} />
          <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Work inbox</div>
        </div>
        <div className="flex items-center gap-2 font-mono" style={{ fontSize: "10.5px" }}>
          <span className="chip">{I.unread} unread</span>
          <span className="chip" style={{ background: "rgba(255,80,80,0.14)", borderColor: "rgba(255,80,80,0.3)", color: "#ffb0a8" }}>{I.flagged} urgent</span>
        </div>
      </div>
      <div className="space-y-2">
        {I.top.map((m, i) => (
          <div key={i} className="flex items-baseline gap-3">
            <div className="font-mono text-muted tabnum" style={{ fontSize: "10.5px", width: 40 }}>{m.when}</div>
            <div className="font-medium truncate" style={{ fontSize: "12.5px", width: 120 }}>{m.from}</div>
            <div className="text-muted truncate flex-1" style={{ fontSize: "12.5px" }}>{m.subj}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotesModule() {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "160ms" }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon name="obsidian" size={14} />
        <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Obsidian · recent</div>
      </div>
      <div className="space-y-2">
        {NOTES.map((n, i) => (
          <div key={i} className="flex items-center justify-between" style={{ fontSize: "12.5px" }}>
            <div className="truncate">{n.title}</div>
            <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>{n.ago}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DevQuicklaunch() {
  const tools = [
    { name: "Claude", icon: "claude" },
    { name: "ChatGPT", icon: "sparkles" },
    { name: "GitHub", icon: "github" },
    { name: "Granite", icon: "wand" },
    { name: "Terminal", icon: "command" },
    { name: "Jira", icon: "jira" },
  ];
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>LLM · Dev</div>
        <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>⌘K to search</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tools.map(t => (
          <button key={t.name} className="tile hairline rounded-md py-2.5 flex flex-col items-center gap-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <Icon name={t.icon} size={16} />
            <div className="font-mono" style={{ fontSize: "10.5px" }}>{t.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function WorkShortcuts() {
  const apps = [
    { n: "Gmail", i: "mail" }, { n: "Cal", i: "calendar" }, { n: "Drive", i: "doc" },
    { n: "Docs", i: "doc" }, { n: "Slides", i: "slide" }, { n: "Sheets", i: "sheet" },
    { n: "Slack", i: "slack" }, { n: "Confl.", i: "bookmark" },
  ];
  return (
    <div className="module p-3 module-enter" style={{ animationDelay: "240ms" }}>
      <div className="font-mono uppercase mb-2 px-1" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Workspace</div>
      <div className="grid grid-cols-4 gap-1.5">
        {apps.map(a => (
          <button key={a.n} className="tile hairline rounded-md py-2 flex flex-col items-center gap-1" style={{ background: "rgba(255,255,255,0.03)" }}>
            <Icon name={a.i} size={14} />
            <div className="font-mono" style={{ fontSize: "10px" }}>{a.n}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RedHatNews() {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "280ms" }}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--rh)" }} />
        <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Red Hat · internal</div>
      </div>
      <ul className="space-y-1.5" style={{ fontSize: "12.5px" }}>
        <li>RHEL AI 1.5 GA freeze · Friday EOD</li>
        <li>Q3 OKR draft circulated to Naren's staff</li>
        <li>Summit: ticket allocations released</li>
      </ul>
    </div>
  );
}
