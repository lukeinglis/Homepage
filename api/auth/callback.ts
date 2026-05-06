import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
  getRedirectUri,
  getGoogleClientId,
  getGoogleClientSecret,
  getAllowedEmail,
} from "./config.js";
import { setSession } from "./session-util.js";

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

  const { code, state, error } = req.query;

  if (error) {
    res.status(400).send(accessDeniedPage("Authentication was cancelled."));
    return;
  }

  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "Missing authorization code" });
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const storedState = cookies.oauth_state;
  if (!state || state !== storedState) {
    res.status(403).json({ error: "Invalid state parameter" });
    return;
  }

  res.setHeader("Set-Cookie", [
    `oauth_state=; Path=/; HttpOnly; Max-Age=0`,
  ]);

  let redirectUri: string;
  let clientId: string;
  let clientSecret: string;
  let allowedEmail: string;
  try {
    redirectUri = getRedirectUri(req);
    clientId = getGoogleClientId();
    clientSecret = getGoogleClientSecret();
    allowedEmail = getAllowedEmail();
  } catch {
    res.status(500).json({ error: "Auth not configured" });
    return;
  }

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
    const text = await tokenResponse.text();
    res.status(502).json({ error: `Token exchange failed: ${text}` });
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
    res.status(502).json({ error: "Failed to fetch user info" });
    return;
  }

  const userinfo = (await userinfoResponse.json()) as {
    email: string;
    name: string;
    picture: string;
  };

  if (userinfo.email.toLowerCase() !== allowedEmail.toLowerCase()) {
    res.status(403).send(accessDeniedPage(
      `The account ${userinfo.email} is not authorized to access this site.`,
    ));
    return;
  }

  setSession(res, {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || "",
    tokenExpiry: Date.now() + tokens.expires_in * 1000,
    email: userinfo.email,
    name: userinfo.name,
    picture: userinfo.picture,
  });

  res.redirect(302, "/");
}

function accessDeniedPage(message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Access Denied</title>
  <style>
    body {
      margin: 0; min-height: 100vh; display: flex; align-items: center;
      justify-content: center; background: #0a0a0a; color: #f4efe7;
      font-family: system-ui, sans-serif; -webkit-font-smoothing: antialiased;
    }
    .card {
      text-align: center; padding: 48px 40px; border-radius: 16px;
      background: rgba(14,12,18,0.5); border: 1px solid rgba(255,255,255,0.12);
      backdrop-filter: blur(20px); max-width: 420px;
    }
    h1 { font-size: 28px; font-weight: 500; margin: 0 0 12px; }
    p { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.6; margin: 0 0 24px; }
    a {
      display: inline-block; padding: 10px 24px; border-radius: 999px;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
      color: #f4efe7; text-decoration: none; font-size: 13px;
    }
    a:hover { background: rgba(255,255,255,0.14); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Access Denied</h1>
    <p>${escapeHtml(message)}</p>
    <a href="/login">Try another account</a>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
