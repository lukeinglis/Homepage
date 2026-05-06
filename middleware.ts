export default function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_astro/") ||
    pathname.startsWith("/favicon")
  ) {
    return;
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const hasSession = cookieHeader.includes("homepage_session=");

  if (!hasSession) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api/auth|login|_astro|favicon).*)",
  ],
};
