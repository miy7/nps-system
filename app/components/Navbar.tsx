"use client";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* โลโก้ซ้ายมือ */}
        <Link href="/" className="text-xl font-bold text-blue-800 flex items-center gap-2">
          📦 NPS Logistics
        </Link>

        {/* เมนูตรงกลาง */}
        <div className="hidden md:flex gap-6 text-gray-600 font-medium">
          <Link href="/" className="hover:text-blue-600 transition">📊 แดชบอร์ด</Link>
          <Link href="/inbound" className="hover:text-blue-600 transition">🚚 ส่งของเข้า</Link>
          <Link href="/approve" className="hover:text-blue-600 transition">✅ ตรวจรับของ</Link>
        </div>

        {/* ปุ่มขวามือ */}
        <LogoutButton />
      </div>
    </nav>
  );
}