import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GOOGLE_AUTH_URL, SCOPES, getRedirectUri, getGoogleClientId } from "./config";
import crypto from "crypto";

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let clientId: string;
  let redirectUri: string;
  try {
    clientId = getGoogleClientId();
    redirectUri = getRedirectUri(req);
  } catch {
    res.status(500).json({ error: "Auth not configured" });
    return;
  }

  const state = crypto.randomBytes(32).toString("hex");

  res.setHeader("Set-Cookie", [
    `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  ]);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    state,
    access_type: "offline",
    prompt: "consent",
  });

  res.redirect(302, `${GOOGLE_AUTH_URL}?${params.toString()}`);
}
