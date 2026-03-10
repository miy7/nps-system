"use server";

import { MaterialType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/session";

const VALID_TYPES = new Set<MaterialType>(["EMT", "IMC", "HDPE", "CABLE"]);

function parsePositiveInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const num = Number.parseInt(value, 10);
  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
}

function parseText(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function createTransaction(formData: FormData) {
  const user = await requireCurrentUser();
  if (user.role === "viewer") throw new Error("Forbidden");

  const materialId = parsePositiveInt(formData.get("materialId"));
  const quantity = parsePositiveInt(formData.get("quantity"));
  const site = parseText(formData.get("site"));
  const building = parseText(formData.get("building"));

  if (!materialId || !quantity || !site || !building) {
    throw new Error("Invalid input");
  }

  const material = await prisma.material.findUnique({
    where: { id: materialId },
    select: { id: true },
  });

  if (!material) {
    throw new Error("Material not found");
  }

  await prisma.transaction.create({
    data: {
      quantity,
      site,
      building,
      status: "PENDING",
      materialId: material.id,
      senderId: user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/approve");
  revalidatePath("/transactions");
}

export async function approveTransaction(formData: FormData) {
  const user = await requireCurrentUser();
  if (user.role === "viewer") throw new Error("Forbidden");

  const id = parsePositiveInt(formData.get("id"));
  if (!id) throw new Error("Invalid input");

  const result = await prisma.transaction.updateMany({
    where: { id, status: "PENDING" },
    data: {
      status: "COMPLETED",
      receiverId: user.id,
      completedAt: new Date(),
    },
  });

  if (result.count === 0) {
    throw new Error("Transaction already processed or not found");
  }

  revalidatePath("/");
  revalidatePath("/approve");
  revalidatePath("/transactions");
}

export async function upsertMaterial(formData: FormData) {
  const user = await requireCurrentUser();
  if (user.role !== "admin") throw new Error("Forbidden");

  const name = parseText(formData.get("name"));
  const unit = parseText(formData.get("unit"));
  const typeRaw = parseText(formData.get("type"));

  if (!name || !unit || !VALID_TYPES.has(typeRaw as MaterialType)) {
    throw new Error("Invalid input");
  }

  await prisma.material.upsert({
    where: { name },
    update: {
      type: typeRaw as MaterialType,
      unit,
    },
    create: {
      name,
      type: typeRaw as MaterialType,
      unit,
    },
  });

  revalidatePath("/materials");
  revalidatePath("/inbound");
  revalidatePath("/outbound");
}
