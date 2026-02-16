import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password.trim() : "";

  if (!username || !password) {
    return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      console.warn("login_failed_user_not_found", { username });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.warn("login_failed_bad_password", {
        username,
        passwordLen: password.length,
        hasWhitespace: /\s/.test(password),
      });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const role = user.role as unknown as string;
    if (role !== "admin" && role !== "store" && role !== "viewer") {
      console.error("login_failed_invalid_role", { username, role });
      return NextResponse.json({ error: "Invalid user role" }, { status: 500 });
    }

    const token = await signToken({
      sub: user.id.toString(),
      role,
      username: user.username,
    });

    const res = NextResponse.json({ success: true });
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (e) {
    console.error("login_failed_exception", e);
    return NextResponse.json({ error: "Login error" }, { status: 500 });
  }
}
