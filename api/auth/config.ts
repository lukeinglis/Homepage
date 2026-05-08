export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_USERINFO_URL =
  "https://www.googleapis.com/oauth2/v3/userinfo";
export const SCOPES = "openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly";

export function getRedirectUri(req: { headers: { host?: string } }): string {
  const host = req.headers.host;
  const protocol = host?.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}/api/auth/callback`;
}

export function getGoogleClientId(): string {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error("GOOGLE_CLIENT_ID is not configured");
  return id;
}

export function getGoogleClientSecret(): string {
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!secret) throw new Error("GOOGLE_CLIENT_SECRET is not configured");
  return secret;
}

export function getAllowedEmail(): string {
  const email = process.env.ALLOWED_EMAIL;
  if (!email) throw new Error("ALLOWED_EMAIL is not configured");
  return email;
}

export function isAuthConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.SESSION_SECRET &&
    process.env.ALLOWED_EMAIL
  );
}
