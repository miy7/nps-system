import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "secret123" });
  
  // ถ้ายังไม่ได้ Login และพยายามเข้าหน้าอื่นๆ ที่ไม่ใช่ Login -> ดีดกลับไป Login
  if (!session && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// กำหนดว่าจะให้ Middleware ทำงานที่หน้าไหนบ้าง
export const config = {
  matcher: ["/", "/inbound", "/approve"], // ป้องกันหน้า Dashboard, ส่งของ, รับของ
};