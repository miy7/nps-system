"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    const userId = Number(payload.sub);
    if (!Number.isFinite(userId)) return null;
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}

// 1. Send materials (creates PENDING transaction)
export async function createTransaction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  if (user.role === "viewer") throw new Error("Forbidden");

  const materialId = parseInt(formData.get("materialId") as string);
  const quantity = parseInt(formData.get("quantity") as string);
  const site = (formData.get("site") as string) || "";
  const building = (formData.get("building") as string) || "";

  if (!Number.isFinite(materialId) || !Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Invalid input");
  }
  if (!site.trim() || !building.trim()) {
    throw new Error("Invalid input");
  }

  await prisma.transaction.create({
    data: {
      quantity,
      site,
      building,
      status: "PENDING",
      material: { connect: { id: materialId } },
      sender: { connect: { id: user.id } },
    },
  });

  revalidatePath("/approve"); // รีเฟรชหน้าคนรับ
  revalidatePath("/");        // รีเฟรชหน้า Dashboard
}

// 2. Receive materials (mark COMPLETED)
export async function approveTransaction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  if (user.role === "viewer") throw new Error("Forbidden");

  const id = parseInt(formData.get("id") as string);
  if (!Number.isFinite(id)) throw new Error("Invalid input");

  await prisma.transaction.update({
    where: { id },
    data: {
      status: "COMPLETED",
      receiver: { connect: { id: user.id } },
      completedAt: new Date(),
    },
    include: { material: true },
  });

  revalidatePath("/approve");
  revalidatePath("/");
}