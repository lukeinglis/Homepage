import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession, setSession } from "./session-util.js";
import { refreshAccessToken } from "./refresh.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = getSession(req);

  if (!session || !session.email) {
    res.json({ authenticated: false });
    return;
  }

  if (session.tokenExpiry && Date.now() > session.tokenExpiry) {
    if (session.refreshToken) {
      try {
        const refreshed = await refreshAccessToken(session.refreshToken);
        session.accessToken = refreshed.accessToken;
        session.tokenExpiry = refreshed.tokenExpiry;
        setSession(res, session);
      } catch {
        res.json({ authenticated: false });
        return;
      }
    } else {
      res.json({ authenticated: false });
      return;
    }
  }

  res.json({
    authenticated: true,
    user: {
      name: session.name,
      email: session.email,
      picture: session.picture,
    },
  });
}
