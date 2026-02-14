// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. สร้าง User
  await prisma.user.upsert({
    where: { username: 'sender' },
    update: {},
    create: { username: 'sender', password: '123', role: 'Sender', name: 'พี่สมชาย (ส่งของ)' },
  })
  
  await prisma.user.upsert({
    where: { username: 'receiver' },
    update: {},
    create: { username: 'receiver', password: '123', role: 'Receiver', name: 'น้องวิชัย (รับของ)' },
  })

  // 2. สร้างสินค้า (ท่อต่างๆ)
  const products = [
    { code: 'EMT-12', name: 'ท่อ EMT 1/2"', category: 'Conduit', unit: 'เส้น', stock: 500, location: 'Warehouse A' },
    { code: 'EMT-12-A', name: 'ท่อ EMT 1/2"', category: 'Conduit', unit: 'เส้น', stock: 1500, location: 'Warehouse B' },
    { code: 'EMT-34', name: 'ท่อ EMT 3/4"', category: 'Conduit', unit: 'เส้น', stock: 200, location: 'Warehouse A' },
    { code: 'IMC-01', name: 'ท่อ IMC 1"', category: 'Conduit', unit: 'เส้น', stock: 150, location: 'Warehouse B' },
    { code: 'WIRE-16', name: 'สายไฟ THW 16 sq.mm', category: 'Wire', unit: 'ม้วน', stock: 50, location: 'Store Room' },
    { code: 'WIRE-300', name: 'สายไฟ THW 300 sq.mm', category: 'Wire', unit: 'ม้วน', stock: 50, location: 'Store Room' },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    })
  }

  console.log('✅ ใส่ข้อมูลเริ่มต้น (Seed) เรียบร้อยแล้ว!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })