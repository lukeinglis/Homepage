import type { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_DOMAINS = [
  "calendar.google.com",
  "outlook.live.com",
  "outlook.office365.com",
  "caldav.icloud.com",
  "calendar.yahoo.com",
  "ics.calendarlabs.com",
];

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === "https:" || parsed.protocol === "webcal:") &&
      ALLOWED_DOMAINS.some(
        (domain) =>
          parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`),
      )
    );
  } catch {
    return false;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
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

    const text = await response.text();
    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.status(200).send(text);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(502).json({ error: `Failed to fetch calendar: ${message}` });
  }
}
