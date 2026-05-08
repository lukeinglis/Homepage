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

  const res = await fetch("/api/calendar-google");
  if (!res.ok) throw new Error("Calendar fetch failed");
  const data = await res.json();

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ events: data.events, timestamp: Date.now() }),
    );
  } catch {
    /* quota */
  }

  return data.events;
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
