import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession } from "./auth/session-util.js";

interface ICSEvent {
  title: string;
  start: string;
  end: string;
  location: string;
  allDay: boolean;
}

function parseICSDate(value: string): { iso: string; allDay: boolean } {
  if (value.length === 8) {
    const y = value.slice(0, 4);
    const m = value.slice(4, 6);
    const d = value.slice(6, 8);
    return { iso: `${y}-${m}-${d}`, allDay: true };
  }
  const y = value.slice(0, 4);
  const m = value.slice(4, 6);
  const d = value.slice(6, 8);
  const h = value.slice(9, 11);
  const mi = value.slice(11, 13);
  const s = value.slice(13, 15);
  const iso = `${y}-${m}-${d}T${h}:${mi}:${s}Z`;
  return { iso, allDay: false };
}

function parseICS(text: string): ICSEvent[] {
  const events: ICSEvent[] = [];
  const blocks = text.split("BEGIN:VEVENT");

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split("END:VEVENT")[0];
    const lines: string[] = [];
    for (const raw of block.split(/\r?\n/)) {
      if (raw.startsWith(" ") || raw.startsWith("\t")) {
        if (lines.length > 0) lines[lines.length - 1] += raw.slice(1);
      } else {
        lines.push(raw);
      }
    }

    let title = "";
    let dtstart = "";
    let dtend = "";
    let location = "";

    for (const line of lines) {
      const colonIdx = line.indexOf(":");
      if (colonIdx < 0) continue;
      const key = line.slice(0, colonIdx).split(";")[0].toUpperCase();
      const val = line.slice(colonIdx + 1).trim();
      if (key === "SUMMARY") title = val;
      if (key === "DTSTART") dtstart = val;
      if (key === "DTEND") dtend = val;
      if (key === "LOCATION") location = val;
    }

    if (!dtstart) continue;

    const start = parseICSDate(dtstart);
    const end = dtend ? parseICSDate(dtend) : start;

    events.push({
      title: title || "(No title)",
      start: start.iso,
      end: end.iso,
      location,
      allDay: start.allDay,
    });
  }

  return events;
}

function isToday(dateStr: string): boolean {
  const now = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isTodayAllDay(dateStr: string): boolean {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const today = `${y}-${m}-${d}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const ty = tomorrow.getFullYear();
  const tm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const td = String(tomorrow.getDate()).padStart(2, "0");
  const tomorrowStr = `${ty}-${tm}-${td}`;
  return dateStr >= today && dateStr <= tomorrowStr;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = getSession(req);
  if (!session || !session.email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const origin = req.headers.origin || "";
  const allowedOrigins = ["https://lukeinglis.me"];
  if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push("http://localhost:4321", "http://localhost:3000");
  }
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Cache-Control", "no-store");

  const icsUrl = process.env.APPLE_CALENDAR_ICS;
  if (!icsUrl) {
    res.json({ events: [], source: "apple", configured: false });
    return;
  }

  try {
    const fetchUrl = icsUrl.replace("webcal://", "https://");
    const icsRes = await fetch(fetchUrl, {
      headers: { "User-Agent": "HomepageDashboard/1.0" },
    });
    if (!icsRes.ok) {
      res.status(502).json({ error: "Failed to fetch Apple Calendar" });
      return;
    }

    const text = await icsRes.text();
    if (text.length > 5 * 1024 * 1024) {
      res.status(413).json({ error: "Calendar file too large" });
      return;
    }

    const allEvents = parseICS(text);
    const todayEvents = allEvents.filter((e) =>
      e.allDay ? isTodayAllDay(e.start) : isToday(e.start),
    );

    todayEvents.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );

    res.json({
      events: todayEvents.map((e) => ({
        ...e,
        calendarName: "Personal (iCloud)",
        calendarColor: "#34C759",
        meetLink: "",
      })),
      source: "apple",
    });
  } catch {
    res.status(500).json({ error: "Failed to parse Apple Calendar" });
  }
}
