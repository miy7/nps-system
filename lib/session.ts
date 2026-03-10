import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const APP_ROLES = ["admin", "store", "viewer"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export function isAppRole(role: string): role is AppRole {
  return APP_ROLES.includes(role as AppRole);
}

export type CurrentUser = {
  id: number;
  username: string;
  role: AppRole;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId)) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true },
    });

    if (!user || !isAppRole(user.role)) return null;

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
