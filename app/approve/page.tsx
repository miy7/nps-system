import { redirect } from "next/navigation";
import { approveTransaction } from "../actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ApprovePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "viewer") redirect("/");

  const pendingItems = await prisma.transaction.findMany({
    where: { status: "PENDING" },
    include: { material: true, sender: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Approve Receiving</h1>
        <p className="text-sm text-slate-500">Confirm pending transfers to move stock into completed state.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
        {pendingItems.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No pending transfers.</p>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-3 font-medium">Created</th>
                <th className="py-2 pr-3 font-medium">Sender</th>
                <th className="py-2 pr-3 font-medium">Location</th>
                <th className="py-2 pr-3 font-medium">Material</th>
                <th className="py-2 pr-3 font-medium">Qty</th>
                <th className="py-2 pr-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-3 pr-3 text-slate-600">{item.createdAt.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-slate-900">{item.sender.username}</td>
                  <td className="py-3 pr-3 text-slate-600">{item.site} / {item.building}</td>
                  <td className="py-3 pr-3 text-slate-900">{item.material.name}</td>
                  <td className="py-3 pr-3 font-semibold text-blue-700">{item.quantity}</td>
                  <td className="py-3 pr-3">
                    <form action={approveTransaction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
