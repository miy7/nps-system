import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type DashboardSearchParams = {
  site?: string;
  building?: string;
};

function normalizeText(input?: string): string {
  if (typeof input !== "string") return "";
  return input.trim();
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: DashboardSearchParams;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const site = normalizeText(searchParams?.site);
  const building = normalizeText(searchParams?.building);

  const [completedTransactions, pendingCount] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        status: "COMPLETED",
        site: site ? { contains: site } : undefined,
        building: building ? { contains: building } : undefined,
      },
      include: { material: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.count({ where: { status: "PENDING" } }),
  ]);

  const stockMap = new Map<number, { id: number; name: string; unit: string; quantity: number }>();

  for (const tx of completedTransactions) {
    const current = stockMap.get(tx.materialId);
    if (!current) {
      stockMap.set(tx.materialId, {
        id: tx.materialId,
        name: tx.material.name,
        unit: tx.material.unit,
        quantity: tx.quantity,
      });
      continue;
    }

    current.quantity += tx.quantity;
  }

  const stock = Array.from(stockMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const totalStockQuantity = stock.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Inventory Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Signed in as <span className="font-semibold">{user.username}</span> ({user.role})
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/transactions" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              View Transactions
            </Link>
            {user.role !== "viewer" ? (
              <>
                <Link href="/outbound" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  New Outbound
                </Link>
                <Link href="/approve" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Approve Receive
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending Receives</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{pendingCount}</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Completed Transactions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{completedTransactions.length}</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Quantity In Stock</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalStockQuantity}</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Filter Stock by Site / Building</h2>

        <form className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            name="site"
            placeholder="Site code (example: CM)"
            defaultValue={site}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <input
            name="building"
            placeholder="Building (example: F)"
            defaultValue={building}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Search
          </button>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Current Stock</h2>

        {stock.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No stock found with current filters.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Material</th>
                  <th className="py-2 pr-4 font-medium">Unit</th>
                  <th className="py-2 pr-4 font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-3 pr-4 font-medium text-slate-900">{item.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.unit}</td>
                    <td className="py-3 pr-4 text-slate-900">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
