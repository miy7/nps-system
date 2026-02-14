// app/api/outbound/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma/db'; // ตรวจสอบ path ให้ถูกนะครับ (ถ้างงให้ใช้ @/prisma/db ถ้าตั้งค่าไว้)

// app/api/outbound/route.ts

// ... (ส่วน import เหมือนเดิม)

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productName, quantity, site } = body;

    // ... (ส่วนค้นหา Product และเช็คของพอไหม เหมือนเดิม) ...
    // ก๊อปโค้ดเดิมส่วนบนมาวาง หรือแก้เฉพาะส่วนด้านล่างนี้ครับ

    const product = await prisma.product.findFirst({
        where: { name: productName }
    });
      
    if (!product || product.stock < quantity) {
        return NextResponse.json({ success: false, message: 'สินค้าไม่พอหรือไม่มีในระบบ' }, { status: 400 });
    }

    // --- จุดที่แก้ไข: ใช้ prisma.$transaction ---
    // เพื่อรับประกันว่า "ตัดของ" และ "จดบันทึก" ต้องสำเร็จพร้อมกัน (ถ้าอันไหนพัง ให้ยกเลิกทั้งคู่)
    
    const result = await prisma.$transaction(async (tx) => {
        // 1. ตัดสต็อก
        const updatedProduct = await tx.product.update({
            where: { id: product.id },
            data: { stock: product.stock - quantity }
        });

        // 2. สร้างประวัติ (Log)
        await tx.stockMovement.create({
            data: {
                type: 'OUT',       // ประเภท: จ่ายออก
                quantity: quantity,
                siteName: site,    // ส่งไปที่ไหน
                productId: product.id // เชื่อมโยงกับสินค้านี้
            }
        });

        return updatedProduct;
    });

    return NextResponse.json({ 
      success: true, 
      message: `บันทึกเรียบร้อย! ตัดสต็อกไป ${quantity} รายการ`,
      remainingStock: result.stock 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}