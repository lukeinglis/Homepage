export interface GmailMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
}

export interface GmailInbox {
  unread: number;
  starred: number;
  messages: GmailMessage[];
}

const CACHE_KEY = "homepage_gmail";
const CACHE_TTL = 5 * 60 * 1000;

export async function fetchInbox(): Promise<GmailInbox> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) return parsed.data;
    }
  } catch {
    /* ignore */
  }

  const res = await fetch("/api/gmail");
  if (!res.ok) throw new Error("Gmail fetch failed");
  const data: GmailInbox = await res.json();

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {
    /* quota */
  }

  return data;
}

export function formatEmailDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "now";
    if (diffMin < 60) return diffMin + "m";
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return diffHr + "h";
    const diffDays = Math.floor(diffHr / 24);
    if (diffDays < 7) return diffDays + "d";
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return (
      (d.getMonth() + 1) +
      "/" +
      d.getDate() +
      " " +
      hour +
      ":" +
      String(m).padStart(2, "0") +
      " " +
      ampm
    );
  } catch {
    return "";
  }
}
