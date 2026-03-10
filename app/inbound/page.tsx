import { redirect } from "next/navigation";
import { createTransaction } from "../actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function InboundPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "viewer") redirect("/");

  const materials = await prisma.material.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Create Inbound Transfer</h1>
      <p className="mt-1 text-sm text-slate-500">Record a new transfer request for receiving workflow.</p>

      <form action={createTransaction} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Material</label>
          <select name="materialId" className="w-full rounded-lg border border-slate-200 px-3 py-2" required>
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Quantity</label>
          <input
            name="quantity"
            type="number"
            min={1}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Site</label>
            <input name="site" type="text" className="w-full rounded-lg border border-slate-200 px-3 py-2" required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Building</label>
            <input name="building" type="text" className="w-full rounded-lg border border-slate-200 px-3 py-2" required />
          </div>
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          Submit Inbound Request
        </button>
      </form>
    </div>
  );
}
