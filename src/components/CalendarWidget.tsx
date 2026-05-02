import { useState, useEffect } from "preact/hooks";
import ICAL from "ical.js";
import { calendarConfig } from "../config/calendar";

interface CalendarEvent {
  summary: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  color?: string;
}

const CACHE_KEY = "calendar-widget-cache";
const CACHE_TTL_MS = calendarConfig.cacheTtlMinutes * 60 * 1000;

function getCachedEvents(): CalendarEvent[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { events, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return events.map((e: Record<string, unknown>) => ({
      ...e,
      startTime: new Date(e.startTime as string),
      endTime: new Date(e.endTime as string),
    }));
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCachedEvents(events: CalendarEvent[]): void {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ events, timestamp: Date.now() }),
    );
  } catch {
    // localStorage full or unavailable
  }
}

function parseICS(icsText: string, color?: string): CalendarEvent[] {
  try {
    const jcal = ICAL.parse(icsText);
    const comp = new ICAL.Component(jcal);
    const vevents = comp.getAllSubcomponents("vevent");

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const events: CalendarEvent[] = [];

    for (const vevent of vevents) {
      const event = new ICAL.Event(vevent);
      const start = event.startDate?.toJSDate();
      const end = event.endDate?.toJSDate();

      if (!start) continue;

      const effectiveEnd = end ?? new Date(start.getTime() + 3600000);
      const allDay = event.startDate?.isDate ?? false;

      if (start < todayEnd && effectiveEnd > todayStart) {
        events.push({
          summary: event.summary ?? "Untitled",
          startTime: start,
          endTime: effectiveEnd,
          allDay,
          color,
        });
      }
    }

    return events;
  } catch {
    return [];
  }
}

function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${ampm}` : `${hour}:${m.toString().padStart(2, "0")}${ampm}`;
}

async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  if (calendarConfig.sources.length === 0) return [];

  const results = await Promise.allSettled(
    calendarConfig.sources.map(async (source) => {
      const res = await fetch("/api/calendar-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: source.url }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      return parseICS(text, source.color);
    }),
  );

  const events: CalendarEvent[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      events.push(...result.value);
    }
  }

  events.sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    return a.startTime.getTime() - b.startTime.getTime();
  });

  return events;
}

function LoadingSkeleton() {
  return (
    <div class="calendar-loading" aria-label="Loading calendar">
      <div class="calendar-skeleton-line" />
      <div class="calendar-skeleton-line calendar-skeleton-short" />
      <div class="calendar-skeleton-line" />
    </div>
  );
}

function EmptyState() {
  return (
    <p class="calendar-empty">No events today</p>
  );
}

function ErrorState() {
  return (
    <p class="calendar-error-text">Could not load calendar</p>
  );
}

export function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cached = getCachedEvents();
    if (cached) {
      setEvents(cached);
      setLoading(false);
      return;
    }

    if (calendarConfig.sources.length === 0) {
      setEvents([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetchCalendarEvents()
      .then((fetched) => {
        if (cancelled) return;
        setEvents(fetched);
        setCachedEvents(fetched);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div class="widget calendar-widget">
      <h2 class="calendar-title">Today's Schedule</h2>
      {loading && <LoadingSkeleton />}
      {!loading && error && <ErrorState />}
      {!loading && !error && events && events.length === 0 && <EmptyState />}
      {!loading && !error && events && events.length > 0 && (
        <ul class="calendar-event-list">
          {events.map((event, i) => (
            <li key={`${event.summary}-${i}`} class="calendar-event-item">
              {event.color && (
                <span
                  class="calendar-event-dot"
                  style={{ backgroundColor: event.color }}
                />
              )}
              <span class="calendar-event-time">
                {event.allDay ? "All day" : formatTime(event.startTime)}
              </span>
              <span class="calendar-event-summary">{event.summary}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
