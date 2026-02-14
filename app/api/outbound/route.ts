import { NextResponse } from 'next/server';
import { Prisma } from "@prisma/client";
import { prisma } from '../../../prisma/db'; // นำเข้า Prisma Client จากไฟล์ db.ts

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productName, quantity, site } = body;

    const product = await prisma.product.findFirst({
      where: { name: productName }
    });

    if (!product || product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: 'สินค้าไม่พอหรือไม่มีในระบบ' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {

        const updatedProduct = await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - quantity }
        });

        await tx.stockMovement.create({
          data: {
            type: 'OUT',
            quantity,
            siteName: site,
            productId: product.id
          }
        });

        return updatedProduct;
      }
    );

    return NextResponse.json({
      success: true,
      message: `บันทึกเรียบร้อย! ตัดสต็อกไป ${quantity} รายการ`,
      remainingStock: result.stock
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}
