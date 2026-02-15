import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Dashboard({ searchParams }: { searchParams: { site?: string; building?: string } }) {
  const site = searchParams.site || "";
  const building = searchParams.building || "";

  const stock = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",
      site: site ? { contains: site } : undefined,
      building: building ? { contains: building } : undefined,
    },
    include: { product: true },
  });

  return (
    <div>
      {/* ส่วนหัวข้อและค้นหา */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🔎 ค้นหาสินค้าคงคลัง</h1>
        <form className="flex flex-col md:flex-row gap-4">
          <input 
            name="site" 
            placeholder="📍 ค้นหา Site (เช่น CM)" 
            defaultValue={site} 
            className="border-gray-200 border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" 
          />
          <input 
            name="building" 
            placeholder="🏢 ค้นหาอาคาร (เช่น F)" 
            defaultValue={building} 
            className="border-gray-200 border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" 
          />
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition transform hover:scale-105">
            ค้นหา
          </button>
        </form>
      </div>

      {/* ส่วนแสดงรายการสินค้าแบบ Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stock.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{item.product.name}</h3>
                <p className="text-sm text-gray-400 font-mono">{item.product.code}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {item.product.unit}
              </span>
            </div>
            
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold text-gray-900">{item.quantity}</span>
              <span className="text-gray-500 mb-1">คงเหลือ</span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                📍 {item.site} - {item.building}
              </div>
              <div className="text-xs">
                {new Date(item.updatedAt).toLocaleDateString('th-TH')}
              </div>
            </div>
          </div>
        ))}

        {stock.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">📦 ไม่พบสินค้าในเงื่อนไขนี้</p>
          </div>
        )}
      </div>
    </div>
  );
}