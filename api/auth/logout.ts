import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clearSession } from "./session-util";

export default function handler(
  req: VercelRequest,
  res: VercelResponse,
): void {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  clearSession(res);
  res.redirect(302, "/login");
}
