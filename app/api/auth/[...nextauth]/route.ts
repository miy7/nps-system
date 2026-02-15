import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // ค้นหา User ใน Database
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        // ถ้าเจอ User และรหัสผ่านตรงกัน (แบบง่าย)
        if (user && user.password === credentials.password) {
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.role, // เราจะแอบเก็บ Role ไว้ในช่อง email เพื่อความง่าย
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // บอกว่าถ้าจะ Login ให้ไปหน้านี้
  },
  secret: process.env.NEXTAUTH_SECRET || "secret123", // รหัสลับสำหรับเข้ารหัส Session
});

export { handler as GET, handler as POST };