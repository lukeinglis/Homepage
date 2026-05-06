import type { SessionOptions } from "iron-session";

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  tokenExpiry: number;
  email: string;
  name: string;
  picture: string;
}

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_USERINFO_URL =
  "https://www.googleapis.com/oauth2/v3/userinfo";
export const SCOPES = "openid email profile";

export function getRedirectUri(req: Request | { headers: { host?: string } }): string {
  const host =
    req instanceof Request
      ? req.headers.get("host")
      : req.headers.host;
  const protocol = host?.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}/api/auth/callback`;
}

export function getSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }
  return {
    cookieName: "homepage_session",
    password,
    ttl: THIRTY_DAYS,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
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
