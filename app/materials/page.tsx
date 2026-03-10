import { MaterialType } from "@prisma/client";
import { redirect } from "next/navigation";
import { upsertMaterial } from "../actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const TYPE_OPTIONS: MaterialType[] = ["EMT", "IMC", "HDPE", "CABLE"];

export default async function MaterialsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  const materials = await prisma.material.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Material Master</h1>
        <p className="mt-1 text-sm text-slate-500">Create new materials or update existing ones by name.</p>

        <form action={upsertMaterial} className="mt-5 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <input
            name="name"
            placeholder="Material name"
            className="rounded-lg border border-slate-200 px-3 py-2"
            required
          />

          <select name="type" className="rounded-lg border border-slate-200 px-3 py-2" required defaultValue="EMT">
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            name="unit"
            placeholder="Unit (e.g. pcs, meter)"
            className="rounded-lg border border-slate-200 px-3 py-2"
            required
          />

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
          >
            Save
          </button>
        </form>
      </section>

      <section className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
        {materials.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No materials found.</p>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-3 font-medium">Name</th>
                <th className="py-2 pr-3 font-medium">Type</th>
                <th className="py-2 pr-3 font-medium">Unit</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-3 pr-3 font-medium text-slate-900">{material.name}</td>
                  <td className="py-3 pr-3 text-slate-600">{material.type}</td>
                  <td className="py-3 pr-3 text-slate-600">{material.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
