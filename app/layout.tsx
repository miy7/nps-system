import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // <--- 1. นำเข้า Navbar ที่เราเพิ่งสร้าง

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NPS Logistics", // <--- 2. เปลี่ยนชื่อเว็บให้ตรงงานจริง
  description: "ระบบบริหารจัดการวัสดุ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {/* 3. วาง Navbar ไว้ด้านบนสุด */}
        <Navbar /> 
        
        {/* 4. จัดเนื้อหาให้อยู่ตรงกลางสวยๆ */}
        <main className="container mx-auto px-4 pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}