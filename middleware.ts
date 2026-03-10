import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

const PUBLIC_PATHS = ["/api/auth/login", "/api/health"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((publicPath) =>
    pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  );

  if (isPublic) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  let payload: { role?: string } | null = null;

  if (token) {
    try {
      payload = await verifyToken(token);
    } catch {
      payload = null;
    }
  }

  if (pathname === "/login" && !payload) {
    return NextResponse.next();
  }

  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = payload.role;
  const isRoleValid = role === "admin" || role === "store" || role === "viewer";

  if (!isRoleValid) {
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));

    response.cookies.set("token", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  }

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    role === "viewer" &&
    (pathname.startsWith("/inbound") ||
      pathname.startsWith("/outbound") ||
      pathname.startsWith("/approve") ||
      pathname.startsWith("/materials"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (role === "store" && pathname.startsWith("/materials")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
