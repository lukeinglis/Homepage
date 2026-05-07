import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession } from "./auth/session-util.js";

const ALLOWED_HOSTNAMES = [
  "calendar.google.com",
  "outlook.live.com",
  "outlook.office365.com",
  "p01-caldav.icloud.com",
  "p02-caldav.icloud.com",
  "p03-caldav.icloud.com",
  "p04-caldav.icloud.com",
  "p05-caldav.icloud.com",
  "p06-caldav.icloud.com",
  "calendar.yahoo.com",
  "ics.calendarlabs.com",
];

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url.replace("webcal://", "https://"));

    if (parsed.protocol !== "https:") return false;

    if (/^\d+\.\d+\.\d+\.\d+$/.test(parsed.hostname)) return false;
    if (parsed.hostname.includes(":")) return false;
    if (parsed.hostname === "localhost") return false;

    if (
      parsed.hostname.endsWith(".internal") ||
      parsed.hostname.endsWith(".local")
    )
      return false;

    if (parsed.username || parsed.password) return false;

    return ALLOWED_HOSTNAMES.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const origin = req.headers.origin || "";
  const allowedOrigins = ["https://lukeinglis.me"];
  if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push("http://localhost:4321", "http://localhost:3000");
  }
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://lukeinglis.me");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = getSession(req);
  if (!session || !session.email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { url } = req.body ?? {};

  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Missing or invalid url parameter" });
    return;
  }

  const fetchUrl = url.replace(/^webcal:/, "https:");

  if (!isAllowedUrl(fetchUrl)) {
    res.status(403).json({ error: "Domain not in allowlist" });
    return;
  }

  const MAX_SIZE = 5 * 1024 * 1024;
  try {
    const response = await fetch(fetchUrl, {
      headers: { Accept: "text/calendar" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      res
        .status(502)
        .json({ error: `Upstream returned ${response.status}` });
      return;
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_SIZE) {
      res.status(413).json({ error: "Calendar file too large" });
      return;
    }

    const text = await response.text();
    if (text.length > MAX_SIZE) {
      res.status(413).json({ error: "Calendar file too large" });
      return;
    }

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.status(200).send(text);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(502).json({ error: `Failed to fetch calendar: ${message}` });
  }
}
