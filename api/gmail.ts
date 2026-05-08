import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession } from "./auth/session-util.js";

interface GmailLabel {
  messagesTotal?: number;
  messagesUnread?: number;
  threadsTotal?: number;
  threadsUnread?: number;
}

interface GmailHeader {
  name: string;
  value: string;
}

interface GmailMessage {
  id: string;
  payload?: {
    headers?: GmailHeader[];
  };
  snippet?: string;
  internalDate?: string;
}

function getHeader(headers: GmailHeader[], name: string): string {
  const h = headers.find(
    (h) => h.name.toLowerCase() === name.toLowerCase(),
  );
  return h?.value || "";
}

function extractSenderName(from: string): string {
  const match = from.match(/^"?([^"<]+)"?\s*</);
  if (match) return match[1].trim();
  const emailMatch = from.match(/^([^@]+)@/);
  if (emailMatch) return emailMatch[1];
  return from;
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
  if (!session || !session.accessToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const origin = req.headers.origin || "";
  const allowedOrigins = ["https://lukeinglis.me"];
  if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push("http://localhost:4321", "http://localhost:3000");
  }
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Cache-Control", "no-store");

  const authHeader = { Authorization: "Bearer " + session.accessToken };

  try {
    const [inboxRes, starredRes, msgsRes] = await Promise.all([
      fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/labels/INBOX",
        { headers: authHeader },
      ),
      fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/labels/STARRED",
        { headers: authHeader },
      ),
      fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&maxResults=5",
        { headers: authHeader },
      ),
    ]);

    if (inboxRes.status === 401) {
      res.status(401).json({ error: "Token expired" });
      return;
    }

    if (!inboxRes.ok || !starredRes.ok || !msgsRes.ok) {
      res.status(502).json({ error: "Failed to fetch Gmail data" });
      return;
    }

    const inboxLabel: GmailLabel = await inboxRes.json();
    const starredLabel: GmailLabel = await starredRes.json();
    const msgsData = await msgsRes.json();

    const messageIds: { id: string }[] = msgsData.messages || [];
    const messages = await Promise.all(
      messageIds.slice(0, 5).map(async (m) => {
        const msgRes = await fetch(
          "https://gmail.googleapis.com/gmail/v1/users/me/messages/" +
            m.id +
            "?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date",
          { headers: authHeader },
        );
        if (!msgRes.ok) return null;
        const msg: GmailMessage = await msgRes.json();
        const headers = msg.payload?.headers || [];
        const from = getHeader(headers, "From");
        const subject = getHeader(headers, "Subject");
        const date = getHeader(headers, "Date");
        return {
          id: msg.id,
          from: extractSenderName(from),
          subject: subject || "(no subject)",
          date,
          snippet: msg.snippet || "",
        };
      }),
    );

    res.json({
      unread: inboxLabel.messagesUnread || 0,
      starred: starredLabel.messagesTotal || 0,
      messages: messages.filter(Boolean),
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch Gmail data" });
  }
}
