import { createTransaction } from "../actions";
import { prisma } from "@/lib/prisma";

export default async function InboundPage() {
  const materials = await prisma.material.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚚 นาย A: บันทึกการส่งของ</h1>
      <form action={createTransaction} className="space-y-4">
        <div>
          <label>สินค้า:</label>
          <select name="materialId" className="border p-2 w-full rounded" required>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-4">
          <input name="quantity" type="number" placeholder="จำนวน" className="border p-2 w-full rounded" required />
        </div>

        <div className="flex gap-4">
          <input name="site" type="text" placeholder="Site (เช่น CM)" className="border p-2 w-full rounded" required />
          <input name="building" type="text" placeholder="อาคาร (เช่น F)" className="border p-2 w-full rounded" required />
        </div>

        <button type="submit" className="bg-blue-600 text-white p-3 rounded w-full hover:bg-blue-700">
          บันทึกส่งของ
        </button>
      </form>
    </div>
  );
}