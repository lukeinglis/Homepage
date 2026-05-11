import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession } from "./session-util.js";
import { GOOGLE_AUTH_URL, getRedirectUri, getGoogleClientId } from "./config.js";
import crypto from "crypto";

const WORK_SCOPES = "openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly";

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = getSession(req);
  if (!session || !session.email) {
    res.status(401).json({ error: "Must be logged in first" });
    return;
  }

  let clientId: string;
  let redirectUri: string;
  try {
    clientId = getGoogleClientId();
    const host = req.headers.host;
    const protocol = host?.includes("localhost") ? "http" : "https";
    redirectUri = `${protocol}://${host}/api/auth/connect-work-callback`;
  } catch {
    res.status(500).json({ error: "Auth not configured" });
    return;
  }

  const state = crypto.randomBytes(32).toString("hex");
  const isProduction = process.env.NODE_ENV === "production";

  res.setHeader("Set-Cookie", [
    `oauth_work_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${isProduction ? "; Secure" : ""}`,
  ]);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: WORK_SCOPES,
    state,
    access_type: "offline",
    prompt: "consent",
    login_hint: "",
  });

  res.redirect(302, `${GOOGLE_AUTH_URL}?${params.toString()}`);
}
