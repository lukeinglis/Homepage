import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getIronSession } from "iron-session";
import { getSessionOptions, type SessionData } from "./config";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const session = await getIronSession<SessionData>(req, res, getSessionOptions());
    session.destroy();
  } catch {
    // Session already invalid, proceed to redirect
  }

  res.redirect(302, "/login");
}
