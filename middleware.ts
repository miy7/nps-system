import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/login" || pathname.startsWith("/api/auth/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  let payload: any = null;

  if (token) {
    try {
      payload = await verifyToken(token);
    } catch {
      payload = null;
    }
  }
  
  // ถ้ายังไม่ได้ Login และพยายามเข้าหน้าอื่นๆ ที่ไม่ใช่ Login -> ดีดกลับไป Login
  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = payload.role as "admin" | "store" | "viewer";

  if (pathname.startsWith("/inbound") || pathname.startsWith("/approve")) {
    if (role === "viewer") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// กำหนดว่าจะให้ Middleware ทำงานที่หน้าไหนบ้าง
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};