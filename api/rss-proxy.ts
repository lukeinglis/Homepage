import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession } from "./auth/session-util.js";

const FEEDS: Record<string, string> = {
  bloomberg: "https://feeds.bloomberg.com/markets/news.rss",
  hn: "https://hnrss.org/frontpage",
  nyt: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
  cnn: "http://rss.cnn.com/rss/cnn_topstories.rss",
  espn: "https://www.espn.com/espn/rss/news",
};

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
}

function parseRSS(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
    const content = match[1];
    const title =
      content.match(
        /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/,
      )?.[1] || "";
    const link =
      content.match(
        /<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/,
      )?.[1] || "";
    const pubDate =
      content.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
    if (title) items.push({ title: title.trim(), link: link.trim(), pubDate });
  }
  return items;
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
  if (process.env.NODE_ENV !== "production")
    allowedOrigins.push("http://localhost:4321");
  if (allowedOrigins.includes(origin))
    res.setHeader("Access-Control-Allow-Origin", origin);

  const feedId = typeof req.query.feed === "string" ? req.query.feed : "";
  const feedUrl = FEEDS[feedId];
  if (!feedUrl) {
    res.status(400).json({
      error: "Unknown feed. Available: " + Object.keys(FEEDS).join(", "),
    });
    return;
  }

  try {
    const feedRes = await fetch(feedUrl, {
      headers: { "User-Agent": "HomepageDashboard/1.0" },
    });
    if (!feedRes.ok) throw new Error("Feed fetch failed: " + feedRes.status);
    const xml = await feedRes.text();
    const items = parseRSS(xml);
    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600",
    );
    res.json({ feed: feedId, items });
  } catch {
    res.status(502).json({ error: "Failed to fetch feed" });
  }
}
