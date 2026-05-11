export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  location: string;
  meetLink: string;
  calendarName: string;
  calendarColor: string;
  allDay: boolean;
}

const CACHE_KEY = "homepage_calendar";
const CACHE_TTL = 5 * 60 * 1000;

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) return parsed.events;
    }
  } catch {
    /* ignore */
  }

  const [googleEvents, appleEvents] = await Promise.all([
    fetch("/api/calendar-google")
      .then((r) => (r.ok ? r.json() : { events: [] }))
      .then((d) => d.events as CalendarEvent[])
      .catch(() => [] as CalendarEvent[]),
    fetch("/api/calendar-apple")
      .then((r) => (r.ok ? r.json() : { events: [] }))
      .then((d) => d.events as CalendarEvent[])
      .catch(() => [] as CalendarEvent[]),
  ]);

  const allEvents = [...googleEvents, ...appleEvents].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ events: allEvents, timestamp: Date.now() }),
    );
  } catch {
    /* quota */
  }

  return allEvents;
}

export function formatEventTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return m === 0
    ? hour + " " + ampm
    : hour + ":" + String(m).padStart(2, "0") + " " + ampm;
}
