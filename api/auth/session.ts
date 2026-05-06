import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getIronSession } from "iron-session";
import { getSessionOptions, type SessionData } from "./config";
import { refreshAccessToken } from "./refresh";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let session;
  try {
    session = await getIronSession<SessionData>(req, res, getSessionOptions());
  } catch {
    res.json({ authenticated: false });
    return;
  }

  if (!session.email) {
    res.json({ authenticated: false });
    return;
  }

  if (session.tokenExpiry && Date.now() > session.tokenExpiry) {
    if (session.refreshToken) {
      try {
        const refreshed = await refreshAccessToken(session.refreshToken);
        session.accessToken = refreshed.accessToken;
        session.tokenExpiry = refreshed.tokenExpiry;
        await session.save();
      } catch {
        session.destroy();
        res.json({ authenticated: false });
        return;
      }
    } else {
      session.destroy();
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
