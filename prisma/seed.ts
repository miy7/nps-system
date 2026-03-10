import { MaterialType, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users: Array<{ username: string; password: string; role: "admin" | "store" | "viewer" }> = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "store", password: "store123", role: "store" },
    { username: "viewer", password: "viewer123", role: "viewer" },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { username: user.username },
      update: { password: hashedPassword, role: user.role },
      create: {
        username: user.username,
        password: hashedPassword,
        role: user.role,
      },
    });
  }

  const materials: Array<{ name: string; type: MaterialType; unit: string }> = [
    { name: 'EMT 1/2"', type: MaterialType.EMT, unit: "piece" },
    { name: 'EMT 3/4"', type: MaterialType.EMT, unit: "piece" },
    { name: 'IMC 1"', type: MaterialType.IMC, unit: "piece" },
    { name: "HDPE", type: MaterialType.HDPE, unit: "meter" },
    { name: "Cable THW", type: MaterialType.CABLE, unit: "roll" },
  ];

  for (const material of materials) {
    await prisma.material.upsert({
      where: { name: material.name },
      update: { type: material.type, unit: material.unit },
      create: material,
    });
  }

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
