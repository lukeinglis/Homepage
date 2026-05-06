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
const THIRTY_DAYS = 60 * 60 * 24 * 30;

function getSecret(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

function encrypt(data: string): string {
  const key = getSecret();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + "." + encrypted;
}

function decrypt(payload: string): string {
  const key = getSecret();
  const [ivB64, encB64] = payload.split(".");
  if (!ivB64 || !encB64) throw new Error("Invalid session format");
  const iv = Buffer.from(ivB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encB64, "base64", "utf8");
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
  const cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(encrypted)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${THIRTY_DAYS}`,
    isProduction ? "Secure" : "",
  ].filter(Boolean).join("; ");
  const existing = res.getHeader("Set-Cookie");
  const cookies = existing
    ? (Array.isArray(existing) ? [...existing, cookie] : [String(existing), cookie])
    : [cookie];
  res.setHeader("Set-Cookie", cookies);
}

export function clearSession(res: VercelResponse): void {
  const cookie = `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0`;
  res.setHeader("Set-Cookie", [cookie]);
}
