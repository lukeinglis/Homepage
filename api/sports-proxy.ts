import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession } from "./auth/session-util.js";

const LEAGUE_ENDPOINTS: Record<string, string> = {
  mlb: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
  nfl: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  nba: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
  epl: "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
  cfb: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
  cbb: "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard",
};

const MY_TEAMS = ["AUB", "BAL", "CHE", "TB", "MIN"];

interface GameInfo {
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

  const games: GameInfo[] = [];

  for (const [league, url] of Object.entries(LEAGUE_ENDPOINTS)) {
    try {
      const espnRes = await fetch(url, {
        headers: { "User-Agent": "HomepageDashboard/1.0" },
      });
      if (!espnRes.ok) continue;
      const data = await espnRes.json();

      for (const event of data.events || []) {
        const competition = event.competitions?.[0];
        if (!competition) continue;

        const competitors = competition.competitors || [];
        const away = competitors.find(
          (c: { homeAway: string }) => c.homeAway === "away",
        );
        const home = competitors.find(
          (c: { homeAway: string }) => c.homeAway === "home",
        );
        if (!away || !home) continue;

        const awayAbbr = away.team?.abbreviation || "";
        const homeAbbr = home.team?.abbreviation || "";
        const status = event.status || {};
        const isLive = status.type?.state === "in";
        const isFinal = status.type?.state === "post";
        const statusText =
          status.type?.shortDetail || status.type?.detail || "";

        const isMine = MY_TEAMS.some(
          (t) =>
            awayAbbr.toUpperCase().includes(t) ||
            homeAbbr.toUpperCase().includes(t),
        );

        const broadcast = competition.broadcasts?.[0]?.names?.[0] || "";

        games.push({
          league,
          away: awayAbbr,
          home: homeAbbr,
          awayScore: isLive || isFinal ? Number(away.score) : null,
          homeScore: isLive || isFinal ? Number(home.score) : null,
          state: statusText,
          live: isLive,
          network: broadcast,
          mine: isMine,
        });
      }
    } catch {
      /* skip failed leagues */
    }
  }

  games.sort((a, b) => {
    if (a.live !== b.live) return a.live ? -1 : 1;
    if (a.mine !== b.mine) return a.mine ? -1 : 1;
    return 0;
  });

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  res.json({ games, lastUpdated: new Date().toISOString() });
}
