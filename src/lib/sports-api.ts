export interface GameInfo {
  league: string;
  away: string;
  home: string;
  awayScore: number | null;
  homeScore: number | null;
  state: string;
  live: boolean;
  network: string;
  mine: boolean;
}

const CACHE_KEY = "homepage_sports";
const CACHE_TTL = 2 * 60 * 1000;

export async function fetchScores(): Promise<GameInfo[]> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) return parsed.games;
    }
  } catch {
    /* ignore */
  }

  const res = await fetch("/api/sports-proxy");
  if (!res.ok) throw new Error("Sports fetch failed");
  const data = await res.json();

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ games: data.games, timestamp: Date.now() }),
    );
  } catch {
    /* quota */
  }

  return data.games;
}
