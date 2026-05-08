import { useState, useEffect } from 'preact/hooks';
import { Icon } from '../scenes/Icons';
import { EmptyState } from './EmptyState';
import { MEETINGS } from '../../data/scene-data';
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
          const workEvents = events.filter((e) =>
            e.calendarName.toLowerCase().includes("redhat") ||
            e.calendarName.toLowerCase().includes("red hat"),
          );
          setLiveEvents(workEvents.length > 0 ? workEvents : null);
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
            <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Work calendar · Red Hat</div>
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

  if (!loading && !liveEvents) {
    return (
      <div className="module work-accent p-4 module-enter" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--rh)" }} />
          <div className="font-mono uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.16em" }}>Work calendar · Red Hat</div>
        </div>
        <div className="font-mono text-muted" style={{ fontSize: "11px" }}>No work events today</div>
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
      .then((events) => {
        if (!cancelled) {
          const personal = events.filter((e) =>
            !e.calendarName.toLowerCase().includes("redhat") &&
            !e.calendarName.toLowerCase().includes("red hat"),
          );
          setLiveEvents(personal.length > 0 ? personal : null);
        }
      })
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
              <span className="font-serif flex-1 truncate">
                {ev.title}
                {ev.location ? " · " + ev.location : ""}
              </span>
              {ev.meetLink && (
                <a href={ev.meetLink} target="_blank" rel="noopener noreferrer" className="font-mono text-muted flex-none" style={{ fontSize: "10px" }}>join ↗</a>
              )}
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

export function YouTubeFrame() {
  return <EmptyState icon="video" message="Connect YouTube" delay="60ms" />;
}

export function YouTubeQueue() {
  return <EmptyState icon="list" message="Connect YouTube" delay="160ms" />;
}

export function StreamingShelf() {
  return <EmptyState icon="tv" message="Connect streaming services" delay="180ms" />;
}
