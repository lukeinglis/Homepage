import { useState, useEffect } from 'preact/hooks';
import { Icon } from '../scenes/Icons';
import { MEETINGS, STREAMING } from '../../data/scene-data';
import type { Meeting } from '../../data/scene-data';
import { fetchCalendarEvents, formatEventTime } from '../../lib/calendar-api.js';
import type { CalendarEvent } from '../../lib/calendar-api.js';

function meetingDotColor(calColor: string): string {
  if (!calColor) return "rgba(180,200,255,0.85)";
  return calColor;
}

export function WorkCalendar({ phase = "day" }: { phase?: string }) {
  const [liveEvents, setLiveEvents] = useState<CalendarEvent[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCalendarEvents()
      .then((events) => {
        if (!cancelled) {
          setLiveEvents(events);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (liveEvents && liveEvents.length > 0) {
    const display = phase === "day" ? liveEvents.slice(0, 5) : liveEvents.slice(-2);
    return (
      <div className="module work-accent p-4 module-enter" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--rh)" }} />
            <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Calendar · today</div>
          </div>
          <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>{liveEvents.length} events</div>
        </div>
        <div className="space-y-1.5">
          {display.map((ev, i) => (
            <div key={i} className="flex items-baseline gap-3" style={{ fontSize: "12.5px" }}>
              <span className="font-mono tabnum text-muted" style={{ fontSize: "11px", width: 52 }}>
                {ev.allDay ? "All day" : formatEventTime(ev.start)}
              </span>
              <span className="rounded-full mt-1" style={{ width: 6, height: 6, background: meetingDotColor(ev.calendarColor) }} />
              <span className="flex-1 truncate font-medium">{ev.title}</span>
              {ev.meetLink && (
                <a href={ev.meetLink} target="_blank" rel="noopener noreferrer" className="font-mono text-muted" style={{ fontSize: "10px" }}>join ↗</a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const meetings = MEETINGS;
  return (
    <div className="module work-accent p-4 module-enter" style={{ animationDelay: "60ms" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--rh)" }} />
          <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Work calendar · Red Hat</div>
        </div>
        <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>
          {loading ? "Loading..." : phase === "day" ? "10 events" : "2 left"}
        </div>
      </div>
      <div className="space-y-1.5">
        {(phase === "day" ? meetings.slice(0, 5) : meetings.slice(-2)).map((m: Meeting, i: number) => (
          <div key={i} className="flex items-baseline gap-3" style={{ fontSize: "12.5px" }}>
            <span className="font-mono tabnum text-muted" style={{ fontSize: "11px", width: 44 }}>{m.t}</span>
            <span className="rounded-full mt-1" style={{
              width: 6, height: 6,
              background: m.type === "ext" ? "var(--rh)" : m.type === "focus" ? "#9ad59c" : m.type === "1on1" ? "#f7b86b" : "rgba(180,200,255,0.85)",
            }} />
            <span className="flex-1 truncate font-medium">{m.title}</span>
            {m.join && <span className="font-mono text-muted" style={{ fontSize: "10px" }}>join ↗</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PersonalCalendar({ scene }: { scene: string }) {
  const [liveEvents, setLiveEvents] = useState<CalendarEvent[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCalendarEvents()
      .then((events) => { if (!cancelled) setLiveEvents(events); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const staticItems: Record<string, { t: string; what: string }[]> = {
    "wkdy_am": [
      { t: "7:00 AM", what: "Run · Esplanade loop · 4 mi" },
      { t: "6:45 PM", what: "Pickup — Lina from soccer" },
      { t: "9:30 PM", what: "Call mom" },
    ],
    "wkdy_pm": [
      { t: "6:45 PM", what: "Pickup — Lina from soccer" },
      { t: "9:00 PM", what: "Wolves @ Nuggets · TNT" },
      { t: "9:30 PM", what: "Call mom" },
    ],
    "wknd_am": [
      { t: "10:00 AM", what: "Farmers market · Copley" },
      { t: "12:30 PM", what: "Chelsea v Man City · USA" },
      { t: "3:30 PM", what: "Auburn at Georgia · CBS" },
      { t: "7:00 PM", what: "Drinks · Dave + Sam" },
    ],
    "wknd_pm": [
      { t: "7:30 PM", what: "Dinner home · short ribs · friends over" },
      { t: "10:00 PM", what: "UFC 322 main · ESPN+ PPV" },
    ],
  };

  if (liveEvents && liveEvents.length > 0) {
    return (
      <div className="module p-4 module-enter" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full" style={{ width: 8, height: 8, background: "#9ad59c" }} />
            <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Personal · life</div>
          </div>
          <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>{liveEvents.length} on deck</div>
        </div>
        <div className="space-y-2">
          {liveEvents.map((ev, i) => (
            <div key={i} className="flex items-baseline gap-3" style={{ fontSize: "12.5px" }}>
              <span className="font-mono tabnum text-muted flex-none" style={{ fontSize: "11px", width: 60 }}>
                {ev.allDay ? "All day" : formatEventTime(ev.start)}
              </span>
              <span className="font-serif">
                {ev.title}
                {ev.location ? " · " + ev.location : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const list = staticItems[scene] || [];
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full" style={{ width: 8, height: 8, background: "#9ad59c" }} />
          <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Personal · life</div>
        </div>
        <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>{list.length} on deck</div>
      </div>
      <div className="space-y-2">
        {list.map((m, i) => (
          <div key={i} className="flex items-baseline gap-3" style={{ fontSize: "12.5px" }}>
            <span className="font-mono tabnum text-muted flex-none" style={{ fontSize: "11px", width: 60 }}>{m.t}</span>
            <span className="font-serif">{m.what}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface VideoData {
  title: string;
  channel: string;
  ch_handle: string;
  durTotal: string;
  durElapsed: string;
  viewers: string;
  thumb: string;
}

export function YouTubeFrame({ video, sub = "Watch while cooking", aspect = "16/9" }: { video?: VideoData; sub?: string; aspect?: string }) {
  const v = video || {
    title: "Kenji — The science of braising, in 12 minutes",
    channel: "J. Kenji López-Alt", ch_handle: "@JKenjiLopezAlt",
    durTotal: "12:04", durElapsed: "3:18", viewers: "1.2M views",
    thumb: "linear-gradient(135deg, #4a2a18 0%, #1a0904 50%, #b35c2a 100%)",
  };
  return (
    <div className="module p-0 overflow-hidden module-enter" style={{ animationDelay: "60ms" }}>
      <div style={{ aspectRatio: aspect, background: v.thumb, position: "relative" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 35%, rgba(255,200,140,0.45), transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55))" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full flex items-center justify-center" style={{
            width: 64, height: 64, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <Icon name="play" size={26} />
          </div>
        </div>
        <div className="absolute flex items-center gap-1.5 font-mono uppercase text-white" style={{ top: 12, left: 12, fontSize: "10px", letterSpacing: "0.18em" }}>
          <span className="live-dot" style={{ background: "#ff3b3b" }} />
          <span style={{ background: "rgba(0,0,0,0.55)", padding: "2px 6px", borderRadius: 4 }}>YouTube · embed</span>
        </div>
        <div className="absolute font-mono text-white" style={{ top: 12, right: 12, fontSize: "10px", background: "rgba(0,0,0,0.55)", padding: "2px 6px", borderRadius: 4 }}>{v.durTotal}</div>
        <div className="absolute inset-x-0" style={{ bottom: 0 }}>
          <div className="rounded mx-3 mb-2" style={{ height: 3, background: "rgba(255,255,255,0.18)" }}>
            <div style={{ width: "27%", height: "100%", background: "#ff3b3b", borderRadius: 2 }} />
          </div>
          <div className="px-3 pb-3 flex items-center justify-between font-mono" style={{ fontSize: "10px", color: "rgba(255,255,255,0.85)" }}>
            <span className="tabnum">{v.durElapsed} / {v.durTotal}</span>
            <span className="flex items-center gap-2">
              <Icon name="pause" size={12} />
              <Icon name="skip" size={12} />
              <span className="tabnum">{v.viewers}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="p-3.5">
        <div className="font-mono uppercase text-muted mb-1" style={{ fontSize: "10px", letterSpacing: "0.16em" }}>{sub}</div>
        <div className="font-serif leading-tight" style={{ fontSize: "16px" }}>{v.title}</div>
        <div className="font-mono text-muted mt-1.5 flex items-center gap-2" style={{ fontSize: "10.5px" }}>
          <span className="rounded-full inline-block" style={{ width: 16, height: 16, background: "linear-gradient(135deg,#5a2616,#a4533c)" }} />
          <span>{v.channel} · {v.ch_handle}</span>
        </div>
      </div>
    </div>
  );
}

export function YouTubeQueue({ scene = "wkdy_pm" }: { scene?: string }) {
  const queue = scene.startsWith("wknd")
    ? [
      { t: "NFL RedZone · Sunday Funday cuts", ch: "NFL", dur: "24:11" },
      { t: "Tifo · How Chelsea won the Champions League by accident", ch: "Tifo Football", dur: "18:34" },
      { t: "Jomboy · Orioles take 4 in a row, sweet swing breakdown", ch: "Jomboy Media", dur: "10:08" },
      { t: "Sara Tanaka · Spring grilling — five sauces, one chicken", ch: "NYT Cooking", dur: "14:02" },
      { t: "Drive to Survive · S7 trailer reaction", ch: "WTF1", dur: "9:48" },
    ]
    : [
      { t: "Why polenta is better than mash", ch: "Ethan Chlebowski", dur: "9:41" },
      { t: "Sunday gravy, Tuesday energy", ch: "Adam Ragusea", dur: "14:27" },
      { t: "Ten-minute weeknight ramen, three ways", ch: "Made With Lau", dur: "11:50" },
    ];
  const bgs = [
    "linear-gradient(135deg,#1a3a2a,#06120a)",
    "linear-gradient(135deg,#0a2a4e,#02080f)",
    "linear-gradient(135deg,#3a1f10,#0c0604)",
    "linear-gradient(135deg,#3e2a18,#0e0604)",
    "linear-gradient(135deg,#3a1010,#0a0000)",
  ];
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "160ms" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="video" size={14} />
          <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>YouTube · queue</div>
        </div>
        <button className="font-mono text-muted" style={{ fontSize: "10.5px" }}>All ↗</button>
      </div>
      <div className="space-y-2.5">
        {queue.map((v, i) => (
          <div key={i} className="flex gap-3">
            <div className="rounded flex-none relative overflow-hidden" style={{ width: 68, height: 40, background: bgs[i] || bgs[0] }}>
              <div className="absolute inset-0 flex items-center justify-center"><Icon name="play" size={14} /></div>
              <div className="absolute font-mono" style={{ right: 4, bottom: 2, fontSize: "8.5px", color: "#fff", background: "rgba(0,0,0,0.7)", padding: "1px 3px", borderRadius: 2 }}>{v.dur}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium leading-tight" style={{ fontSize: "12px" }}>{v.t}</div>
              <div className="font-mono text-muted mt-0.5" style={{ fontSize: "10.5px" }}>{v.ch}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StreamingShelf({ scene = "wknd_pm" }: { scene?: string }) {
  const showKey = scene.startsWith("wknd") ? "wknd_pm" : "wkdy_pm";
  const shows = STREAMING[showKey] || STREAMING.wkdy_pm;
  const bgs = [
    "linear-gradient(180deg,#0a2230,#040b10)",
    "linear-gradient(180deg,#1a2030,#06080f)",
    "linear-gradient(180deg,#3a1a0a,#100604)",
    "linear-gradient(180deg,#1a1a2e,#070710)",
  ];
  const rows = scene === "wknd_pm" ? [
    {
      row: "Continue watching", items: shows.map((s, i) => ({
        t: s.title, svc: s.service, left: s.note,
        bg: bgs[i % bgs.length],
        new: s.badge === "NEW", live: false,
      })),
    },
    {
      row: "Sports tonight on streaming", items: [
        { t: "Wolves @ Nuggets G4", svc: "TNT", left: "8:30 ET", bg: "linear-gradient(180deg,#0c2340,#236192)", live: true, new: false },
        { t: "UFC 322 PPV", svc: "ESPN+", left: "10:00 ET", bg: "linear-gradient(180deg,#3a0606,#0e0202)", live: false, new: false },
        { t: "MLS · Galaxy v LAFC", svc: "Apple TV", left: "10:30 ET", bg: "linear-gradient(180deg,#1a1a1a,#000000)", live: false, new: false },
        { t: "F1 Miami · qualifying", svc: "F1 TV", left: "recap", bg: "linear-gradient(180deg,#3a0606,#100000)", live: false, new: false },
      ]
    },
  ] : [
    {
      row: "Tonight's pick", items: shows.map((s, i) => ({
        t: s.title, svc: s.service, left: s.note,
        bg: bgs[i % bgs.length],
        new: s.badge === "NEW", live: false,
      })),
    },
  ];
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: "180ms" }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon name="tv" size={14} />
        <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Streaming</div>
      </div>
      <div className="space-y-4">
        {rows.map((r, ri) => (
          <div key={ri}>
            <div className="font-mono uppercase text-muted mb-2" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>{r.row}</div>
            <div className="grid grid-cols-4 gap-2">
              {r.items.map((it: { t: string; svc: string; left: string; bg: string; live?: boolean; new?: boolean }, i: number) => (
                <div key={i} className="rounded-lg overflow-hidden tile hairline">
                  <div className="relative" style={{ aspectRatio: "3/4", background: it.bg }}>
                    {it.live && <div className="absolute" style={{ top: 8, left: 8 }}><span className="chip" style={{ background: "rgba(255,59,59,0.18)", borderColor: "rgba(255,59,59,0.4)", color: "#ffb0a8" }}><span className="live-dot" />LIVE</span></div>}
                    {it.new && !it.live && <div className="absolute" style={{ top: 8, left: 8 }}><span className="chip" style={{ background: "rgba(122,223,255,0.16)", borderColor: "rgba(122,223,255,0.3)", color: "#bdeaff" }}>NEW</span></div>}
                    <div className="absolute inset-x-0 p-2.5" style={{ bottom: 0, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.7))" }}>
                      <div className="font-medium font-serif leading-tight" style={{ fontSize: "12px" }}>{it.t}</div>
                      <div className="font-mono text-muted mt-0.5 flex justify-between" style={{ fontSize: "9.5px" }}><span>{it.svc}</span><span>{it.left}</span></div>
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
