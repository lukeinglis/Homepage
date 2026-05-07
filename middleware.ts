export default function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (
    pathname.startsWith("/api/auth/") ||
    pathname === "/login" ||
    pathname.startsWith("/_astro/") ||
    pathname.startsWith("/favicon")
  ) {
    return;
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = extractCookie(cookieHeader, "homepage_session");
  const sigCookie = extractCookie(cookieHeader, "homepage_session_sig");

  if (!sessionCookie || sessionCookie.length < 10) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (!sigCookie || !/^[0-9a-f]{64}$/.test(sigCookie)) {
    return Response.redirect(new URL("/login", request.url));
  }
}

function extractCookie(header: string, name: string): string | null {
  const match = header.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export const config = {
  matcher: ["/((?!api/auth|login|_astro|favicon).*)"],
};
