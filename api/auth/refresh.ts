import { GOOGLE_TOKEN_URL, getGoogleClientId, getGoogleClientSecret } from "./config";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; tokenExpiry: number }> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getGoogleClientId(),
      client_secret: getGoogleClientSecret(),
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as TokenResponse;
  return {
    accessToken: data.access_token,
    tokenExpiry: Date.now() + data.expires_in * 1000,
  };
}
