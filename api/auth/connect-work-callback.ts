import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import {
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
  getGoogleClientId,
  getGoogleClientSecret,
  getAllowedEmail,
} from "./config.js";
import { getSession, setWorkSession } from "./session-util.js";

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const pair of cookieHeader.split(";")) {
    const [key, ...rest] = pair.trim().split("=");
    if (key) result[key.trim()] = rest.join("=").trim();
  }
  return result;
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
    res.redirect(302, "/login");
    return;
  }

  const { code, state, error } = req.query;

  if (error) {
    res.redirect(302, "/?work_connect=cancelled");
    return;
  }

  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "Missing authorization code" });
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const storedState = cookies.oauth_work_state;

  res.setHeader("Set-Cookie", [
    `oauth_work_state=; Path=/; HttpOnly; Max-Age=0`,
  ]);

  if (!state || typeof state !== "string" || !storedState) {
    res.status(403).json({ error: "Invalid state parameter" });
    return;
  }

  const stateBuffer = Buffer.from(String(state));
  const storedBuffer = Buffer.from(storedState);
  if (stateBuffer.length !== storedBuffer.length || !crypto.timingSafeEqual(stateBuffer, storedBuffer)) {
    res.status(403).json({ error: "Invalid state parameter" });
    return;
  }

  let clientId: string;
  let clientSecret: string;
  try {
    clientId = getGoogleClientId();
    clientSecret = getGoogleClientSecret();
  } catch {
    res.status(500).json({ error: "Auth not configured" });
    return;
  }

  const host = req.headers.host;
  const protocol = host?.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/auth/connect-work-callback`;

  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    res.redirect(302, "/?work_connect=failed");
    return;
  }

  const tokens = (await tokenResponse.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  const userinfoResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userinfoResponse.ok) {
    res.redirect(302, "/?work_connect=failed");
    return;
  }

  const userinfo = (await userinfoResponse.json()) as {
    email: string;
    name: string;
    picture: string;
  };

  setWorkSession(res, {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || "",
    tokenExpiry: Date.now() + tokens.expires_in * 1000,
    email: userinfo.email,
    name: userinfo.name,
    picture: userinfo.picture,
  });

  res.redirect(302, "/?work_connect=success");
}
