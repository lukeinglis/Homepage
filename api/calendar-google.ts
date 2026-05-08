import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession } from "./auth/session-util.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = getSession(req);
  if (!session || !session.accessToken) {
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

  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    const calListRes = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      { headers: { Authorization: "Bearer " + session.accessToken } },
    );

    if (calListRes.status === 401) {
      res.status(401).json({ error: "Token expired" });
      return;
    }
    if (!calListRes.ok) {
      res.status(502).json({ error: "Failed to fetch calendars" });
      return;
    }

    const calList = await calListRes.json();
    const calendars = calList.items || [];

    const allEvents: {
      title: string;
      start: string;
      end: string;
      location: string;
      meetLink: string;
      calendarName: string;
      calendarColor: string;
      allDay: boolean;
    }[] = [];

    for (const cal of calendars) {
      try {
        const params = new URLSearchParams({
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          singleEvents: "true",
          orderBy: "startTime",
          maxResults: "20",
        });
        const eventsRes = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/" +
            encodeURIComponent(cal.id) +
            "/events?" +
            params,
          { headers: { Authorization: "Bearer " + session.accessToken } },
        );
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          for (const event of eventsData.items || []) {
            allEvents.push({
              title: event.summary || "(No title)",
              start: event.start?.dateTime || event.start?.date || "",
              end: event.end?.dateTime || event.end?.date || "",
              location: event.location || "",
              meetLink: event.hangoutLink || "",
              calendarName: cal.summary || "",
              calendarColor: cal.backgroundColor || "",
              allDay: !!event.start?.date,
            });
          }
        }
      } catch {
        /* skip failed calendars */
      }
    }

    allEvents.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );

    res.json({ events: allEvents });
  } catch {
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
}
