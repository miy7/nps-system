import { approveTransaction } from "../actions";
import { prisma } from "@/lib/prisma";

export default async function ApprovePage() {
  // ดึงรายการที่ยังไม่ได้รับ (PENDING)
  const pendingItems = await prisma.transaction.findMany({
    where: { status: "PENDING" },
    include: { material: true, sender: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">✅ นาย B: ตรวจรับของ</h1>
      
      {pendingItems.length === 0 ? (
        <p className="text-gray-500">ไม่มียอดค้างรับจ้า</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">เวลา</th>
              <th className="border p-2">ผู้ส่ง</th>
              <th className="border p-2">สถานที่</th>
              <th className="border p-2">วัสดุ</th>
              <th className="border p-2">จำนวน</th>
              <th className="border p-2">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {pendingItems.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border p-2">{item.createdAt.toLocaleTimeString()}</td>
                <td className="border p-2">{item.sender.username}</td>
                <td className="border p-2">{item.site} / {item.building}</td>
                <td className="border p-2">{item.material.name}</td>
                <td className="border p-2 font-bold text-blue-600">{item.quantity}</td>
                <td className="border p-2">
                  <form action={approveTransaction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                      กดรับของ
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}