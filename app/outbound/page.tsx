import Link from "next/link";
import { redirect } from "next/navigation";
import { createTransaction } from "../actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function OutboundPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "viewer") redirect("/");

  const materials = await prisma.material.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Create Outbound Transfer</h1>
          <p className="text-sm text-slate-500">This record will appear in approve queue as PENDING.</p>
        </div>
        <Link href="/" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Back
        </Link>
      </div>

      <form action={createTransaction} className="space-y-5 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Destination Site</label>
          <input
            name="site"
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="Example: CM"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Destination Building</label>
          <input
            name="building"
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="Example: F"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Material</label>
            <select
              name="materialId"
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              required
            >
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
              type="number"
              name="quantity"
              min={1}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Submit Transfer
        </button>
      </form>
    </div>
  );
}
