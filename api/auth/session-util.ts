import crypto from "crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  tokenExpiry: number;
  email: string;
  name: string;
  picture: string;
}

const COOKIE_NAME = "homepage_session";
const SIG_COOKIE_NAME = "homepage_session_sig";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

function getSecret(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }
  const salt = process.env.SESSION_SALT || "lukeinglis.me-homepage-session";
  return crypto.pbkdf2Sync(secret, salt, 100000, 32, "sha256");
}

function encrypt(data: string): string {
  const key = getSecret();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();
  return (
    iv.toString("base64") +
    "." +
    encrypted +
    "." +
    authTag.toString("base64")
  );
}

function decrypt(payload: string): string {
  const key = getSecret();
  const parts = payload.split(".");
  if (parts.length !== 3) throw new Error("Invalid session format");
  const [ivB64, encB64, tagB64] = parts;
  const iv = Buffer.from(ivB64!, "base64");
  const authTag = Buffer.from(tagB64!, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encB64!, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const result: Record<string, string> = {};
  for (const pair of header.split(";")) {
    const [key, ...rest] = pair.trim().split("=");
    if (key) result[key.trim()] = decodeURIComponent(rest.join("=").trim());
  }
  return result;
}

export function getSessionHmac(email: string): string {
  const key = getSecret();
  return crypto
    .createHmac("sha256", key)
    .update(email.toLowerCase())
    .digest("hex");
}

export function getSession(req: VercelRequest): SessionData | null {
  const cookies = parseCookies(req.headers.cookie);
  const raw = cookies[COOKIE_NAME];
  if (!raw) return null;
  try {
    const json = decrypt(raw);
    return JSON.parse(json) as SessionData;
  } catch {
    return null;
  }
}

export function setSession(res: VercelResponse, data: SessionData): void {
  const json = JSON.stringify(data);
  const encrypted = encrypt(json);
  const isProduction = process.env.NODE_ENV === "production";
  const securePart = isProduction ? "; Secure" : "";
  const sessionCookie = [
    `${COOKIE_NAME}=${encodeURIComponent(encrypted)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${THIRTY_DAYS}`,
    isProduction ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  const hmac = getSessionHmac(data.email);
  const hmacCookie = `${SIG_COOKIE_NAME}=${hmac}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${THIRTY_DAYS}${securePart}`;

  const existing = res.getHeader("Set-Cookie");
  const cookies = existing
    ? Array.isArray(existing)
      ? [...existing, sessionCookie, hmacCookie]
      : [String(existing), sessionCookie, hmacCookie]
    : [sessionCookie, hmacCookie];
  res.setHeader("Set-Cookie", cookies);
}

export function clearSession(res: VercelResponse): void {
  const sessionClear = `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0`;
  const sigClear = `${SIG_COOKIE_NAME}=; Path=/; Max-Age=0`;
  res.setHeader("Set-Cookie", [sessionClear, sigClear]);
}
