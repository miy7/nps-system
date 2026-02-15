// app/page.tsx
import { Prisma, Product } from "@prisma/client";
type StockLogWithProduct = Prisma.StockMovementGetPayload<{
  include: { product: true };
}>;
import { prisma } from '../prisma/db';
import Link from 'next/link';

export const dynamic = "force-dynamic";


// ฟังก์ชันดึงสินค้า (เหมือนเดิม)
async function getProducts(): Promise<Product[]> {
  return await prisma.product.findMany();
}


// --- ฟังก์ชันใหม่: ดึงประวัติ 5 รายการล่าสุด ---
async function getRecentLogs(): Promise<StockLogWithProduct[]> {
  return await prisma.stockMovement.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { product: true }
  });
}


export default async function Home() {
  const products = await getProducts();
  const logs = await getRecentLogs(); // เรียกใช้ฟังก์ชันใหม่

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      
      {/* Header (เหมือนเดิม) */}
      <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold tracking-wide">NPS Logistics</h1>
          <p className="text-xs text-blue-200">ระบบบริหารจัดการวัสดุ</p>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto">
        
        {/* Stats Cards (เหมือนเดิม) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* ... โค้ด Card เดิม ... */}
        </div>

        {/* Action Buttons (เหมือนเดิม) */}
        <div className="flex gap-4 mb-6">
            <Link href="/outbound" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
              <span>🚚</span> บันทึกการส่งของ (Outbound)
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ตารางซ้าย: รายการวัสดุคงเหลือ (เอาไว้ 2 ใน 3 ของหน้าจอ) */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-700">📦 คลังสินค้าปัจจุบัน</h2>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="p-4">สินค้า</th>
                        <th className="p-4 text-right">คงเหลือ</th>
                        <th className="p-4">สถานที่</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {products.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-4 text-blue-900 font-medium">{item.name}</td>
                        <td className="p-4 text-right font-bold">{item.stock} {item.unit}</td>
                        <td className="p-4 text-sm text-gray-500">{item.location}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* ตารางขวา: ประวัติล่าสุด (เอาไว้ 1 ใน 3) */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 h-fit">
                <div className="p-4 border-b bg-blue-50 border-blue-100">
                    <h2 className="text-lg font-bold text-blue-800">🕒 ความเคลื่อนไหวล่าสุด</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {logs.length === 0 ? (
                        <p className="p-4 text-gray-400 text-sm text-center">ยังไม่มีประวัติการส่งของ</p>
                    ) : logs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50 transition">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-gray-700 text-sm">{log.product.name}</span>
                                <span className="text-xs text-gray-400">
                                    {new Date(log.createdAt).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-bold">
                                    -{log.quantity} (ออก)
                                </span>
                                <span className="text-xs text-gray-500 truncate max-w-[100px]" title={log.siteName || ''}>
                                    ไป: {log.siteName}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </main>
  );
}