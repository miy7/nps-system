const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // -------------------------
  // 1. สร้าง User (นาย A และ นาย B)
  // -------------------------
  console.log('🌱 กำลังสร้าง User...')
  
  await prisma.user.upsert({
    where: { username: 'mr_a' },
    update: {},
    create: {
      username: 'mr_a',
      password: '123',
      name: 'นาย A (ผู้ส่ง)',
      role: 'SENDER',
    },
  })

  await prisma.user.upsert({
    where: { username: 'mr_b' },
    update: {},
    create: {
      username: 'mr_b',
      password: '123',
      name: 'นาย B (ผู้รับ)',
      role: 'APPROVER',
    },
  })

  // -------------------------
  // 2. สร้างสินค้าตัวอย่าง (Products)
  // -------------------------
  console.log('🌱 กำลังสร้างสินค้า...')

  const products = [
    { code: 'EMT-12', name: 'ท่อ EMT 1/2"', unit: 'เส้น' },
    { code: 'EMT-34', name: 'ท่อ EMT 3/4"', unit: 'เส้น' },
    { code: 'IMC-1', name: 'ท่อ IMC 1"', unit: 'เส้น' },
    { code: 'THW-16', name: 'สายไฟ THW 16 sq.mm', unit: 'ม้วน' },
    { code: 'THW-300', name: 'สายไฟ THW 300 sq.mm', unit: 'ม้วน' },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { code: p.code },
      update: {},
      create: p
    })
  }

  console.log('✅ Seed ข้อมูลเสร็จสมบูรณ์ทั้งหมดแล้ว!')
}

// เรียกใช้งานฟังก์ชัน main
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })