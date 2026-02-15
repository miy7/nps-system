const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('123', 10)

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hash, role: 'admin', name: 'Admin' }
  })

  await prisma.user.upsert({
    where: { username: 'store' },
    update: {},
    create: { username: 'store', password: hash, role: 'store', name: 'Store Staff' }
  })

  await prisma.user.upsert({
    where: { username: 'viewer' },
    update: {},
    create: { username: 'viewer', password: hash, role: 'viewer', name: 'Viewer' }
  })

  const products = [
    { code: 'EMT-12', name: 'ท่อ EMT 1/2"', unit: 'เส้น' },
    { code: 'EMT-34', name: 'ท่อ EMT 3/4"', unit: 'เส้น' },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { code: p.code },
      update: {},
      create: p
    })
  }

  console.log("✅ Seed complete")
}

main().finally(() => prisma.$disconnect())
