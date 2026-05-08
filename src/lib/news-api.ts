export interface NewsItem {
  title: string;
  link: string;
}

const CACHE_KEY_PREFIX = "homepage_news_";
const CACHE_TTL = 30 * 60 * 1000;

export async function fetchNews(feedId: string): Promise<NewsItem[]> {
  const cacheKey = CACHE_KEY_PREFIX + feedId;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) return parsed.items;
    }
  } catch {
    /* ignore */
  }

  const res = await fetch("/api/rss-proxy?feed=" + feedId);
  if (!res.ok) throw new Error("News fetch failed");
  const data = await res.json();
  const items = (data.items || []).map(
    (i: { title: string; link: string }) => ({
      title: i.title,
      link: i.link,
    }),
  );

  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ items, timestamp: Date.now() }),
    );
  } catch {
    /* quota */
  }

  return items;
}
