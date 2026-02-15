import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Dashboard({ searchParams }: { searchParams: { site?: string; building?: string } }) {
  const site = searchParams.site || "";     // ถ้าไม่เลือก ให้โชว์ว่างๆ หรือทั้งหมด
  const building = searchParams.building || "";

  // ดึงเฉพาะรายการที่ "รับแล้ว" (COMPLETED) และตรงกับ Site/Building ที่เลือก
  const stock = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",
      site: site ? { contains: site } : undefined,
      building: building ? { contains: building } : undefined,
    },
    include: { product: true },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard คลังสินค้า</h1>

      {/* ตัวกรอง */}
      <form className="flex gap-4 mb-8 bg-gray-100 p-4 rounded-lg">
        <input name="site" placeholder="ค้นหา Site (เช่น CM)" defaultValue={site} className="border p-2 rounded" />
        <input name="building" placeholder="ค้นหาอาคาร (เช่น F)" defaultValue={building} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">ค้นหา</button>
      </form>

      {/* ตารางแสดงของที่มีอยู่ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stock.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow hover:shadow-md bg-white">
            <h3 className="font-bold text-lg">{item.product.name}</h3>
            <p className="text-gray-600">จำนวน: <span className="text-2xl font-bold text-blue-600">{item.quantity}</span> {item.product.unit}</p>
            <hr className="my-2"/>
            <p className="text-sm text-gray-500">📍 {item.site} - อาคาร {item.building}</p>
            <p className="text-xs text-gray-400 mt-1">รับโดย: {item.receiver} เมื่อ {item.updatedAt.toLocaleDateString()}</p>
          </div>
        ))}
        {stock.length === 0 && <p className="text-gray-500">ไม่พบสินค้าใน Site/อาคาร นี้</p>}
      </div>
    </div>
  );
}