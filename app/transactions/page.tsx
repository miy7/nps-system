import { TransactionStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type TransactionSearchParams = {
  status?: string;
  site?: string;
  building?: string;
};

function parseStatus(status?: string): TransactionStatus | undefined {
  if (status === "PENDING" || status === "COMPLETED") return status;
  return undefined;
}

function normalizeText(value?: string): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: TransactionSearchParams;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const status = parseStatus(searchParams?.status);
  const site = normalizeText(searchParams?.site);
  const building = normalizeText(searchParams?.building);

  const transactions = await prisma.transaction.findMany({
    where: {
      status,
      site: site ? { contains: site } : undefined,
      building: building ? { contains: building } : undefined,
    },
    include: {
      material: true,
      sender: { select: { username: true } },
      receiver: { select: { username: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
        <p className="mt-1 text-sm text-slate-500">Track pending and completed material movement records.</p>

        <form className="mt-4 grid gap-3 md:grid-cols-[180px_1fr_1fr_auto]">
          <select name="status" defaultValue={status ?? ""} className="rounded-lg border border-slate-200 px-3 py-2">
            <option value="">All status</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <input
            name="site"
            placeholder="Site"
            defaultValue={site}
            className="rounded-lg border border-slate-200 px-3 py-2"
          />

          <input
            name="building"
            placeholder="Building"
            defaultValue={building}
            className="rounded-lg border border-slate-200 px-3 py-2"
          />

          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
            Search
          </button>
        </form>
      </section>

      <section className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
        {transactions.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No transactions found.</p>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-3 font-medium">Created</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Material</th>
                <th className="py-2 pr-3 font-medium">Qty</th>
                <th className="py-2 pr-3 font-medium">From User</th>
                <th className="py-2 pr-3 font-medium">Approved By</th>
                <th className="py-2 pr-3 font-medium">Location</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-3 pr-3 text-slate-600">{tx.createdAt.toLocaleString()}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        tx.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-slate-900">{tx.material.name}</td>
                  <td className="py-3 pr-3 font-semibold text-slate-900">{tx.quantity}</td>
                  <td className="py-3 pr-3 text-slate-600">{tx.sender.username}</td>
                  <td className="py-3 pr-3 text-slate-600">{tx.receiver?.username ?? "-"}</td>
                  <td className="py-3 pr-3 text-slate-600">{tx.site} / {tx.building}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
