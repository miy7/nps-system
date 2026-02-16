// app/outbound/page.tsx
import Link from 'next/link';
import { prisma } from "@/lib/prisma";
import { createTransaction } from "../actions";

export default async function OutboundPage() {
  const materials = await prisma.material.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h1 className="text-xl font-bold">🚚 บันทึกการส่งของ (Outbound)</h1>
          <Link href="/" className="text-sm bg-blue-800 px-3 py-1 rounded hover:bg-blue-900 transition">
            ← กลับหน้าหลัก
          </Link>
        </div>

        <form action={createTransaction} className="p-8 space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">ไปส่งที่ไซต์งานไหน?</label>
            <input
              name="site"
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
              placeholder="เช่น CM"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">อาคาร</label>
            <input
              name="building"
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
              placeholder="เช่น F"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">เลือกวัสดุ</label>
              <select
                name="materialId"
                className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
                required
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">จำนวน</label>
              <input 
                type="number" 
                name="quantity"
                className="w-full border border-gray-300 p-3 rounded-lg text-black"
                min="1"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full text-white font-bold py-3 rounded-lg shadow transition bg-blue-600 hover:bg-blue-700"
          >
            ยืนยันการส่งของ
          </button>
        </form>
      </div>
    </div>
  );
}