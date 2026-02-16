const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding users...')

  const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'admin123', 10)
  const storePassword = await bcrypt.hash(process.env.SEED_STORE_PASSWORD || 'store123', 10)
  const viewerPassword = await bcrypt.hash(process.env.SEED_VIEWER_PASSWORD || 'viewer123', 10)

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: adminPassword, role: 'admin' },
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'admin',
    },
  })

  await prisma.user.upsert({
    where: { username: 'store' },
    update: { password: storePassword, role: 'store' },
    create: {
      username: 'store',
      password: storePassword,
      role: 'store',
    },
  })

  await prisma.user.upsert({
    where: { username: 'viewer' },
    update: { password: viewerPassword, role: 'viewer' },
    create: {
      username: 'viewer',
      password: viewerPassword,
      role: 'viewer',
    },
  })

  console.log('🌱 Seeding materials...')

  const materials = [
    { name: 'EMT 1/2"', type: 'EMT', unit: 'เส้น' },
    { name: 'EMT 3/4"', type: 'EMT', unit: 'เส้น' },
    { name: 'IMC 1"', type: 'IMC', unit: 'เส้น' },
    { name: 'HDPE', type: 'HDPE', unit: 'เมตร' },
    { name: 'Cable THW', type: 'CABLE', unit: 'ม้วน' },
  ]

  for (const m of materials) {
    await prisma.material.upsert({
      where: { name: m.name },
      update: { type: m.type, unit: m.unit },
      create: m,
    })
  }

  console.log('✅ Seed completed')
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