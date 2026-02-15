const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('123', 10)

  // Users
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      name: 'admin (Admin)'
    },
  })

  await prisma.user.upsert({
    where: { username: 'store' },
    update: {},
    create: {
      username: 'store',
      password: hashedPassword,
      role: 'store',
      name: 'atore (Store)'
    },
  })

  await prisma.user.upsert({
    where: { username: 'viewer' },
    update: {},
    create: {
      username: 'viewer',
      password: hashedPassword,
      role: 'viewer',
      name: 'ผู้ชมระบบ'
    },
  })

  // Products
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

  console.log('✅ Seed สำเร็จแล้ว')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
