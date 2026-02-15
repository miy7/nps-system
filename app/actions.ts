"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// 1. นาย A บันทึกของเข้า (สถานะ PENDING)
export async function createTransaction(formData: FormData) {
  const productId = parseInt(formData.get("productId") as string);
  const quantity = parseInt(formData.get("quantity") as string);
  const site = formData.get("site") as string;
  const building = formData.get("building") as string;
  const sender = formData.get("sender") as string;

  await prisma.transaction.create({
    data: {
      productId,
      quantity,
      site,
      building,
      sender,
      status: "PENDING", // รอรับ
    },
  });

  revalidatePath("/approve"); // รีเฟรชหน้าคนรับ
  revalidatePath("/");        // รีเฟรชหน้า Dashboard
}

// 2. นาย B กดรับของ (เปลี่ยนสถานะเป็น COMPLETED)
export async function approveTransaction(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const receiverName = "นาย B"; // อนาคตอาจจะดึงจาก Login

  // อัปเดตสถานะใน Database
  const updatedTx = await prisma.transaction.update({
    where: { id },
    data: {
      status: "COMPLETED",
      receiver: receiverName,
    },
    include: { product: true } // ดึงข้อมูลสินค้ามาด้วยเผื่อยิง API
  });

  // --- จุดเชื่อมต่อ API ในอนาคต ---
  // await fetch('https://another-web.com/api/stock', {
  //   method: 'POST',
  //   body: JSON.stringify(updatedTx)
  // });
  // -----------------------------

  revalidatePath("/approve");
  revalidatePath("/");
}