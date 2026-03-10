import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { getCurrentUser, type AppRole } from "@/lib/session";

function getMenuByRole(role: AppRole) {
  const common = [
    { href: "/", label: "Dashboard" },
    { href: "/transactions", label: "Transactions" },
  ];

  if (role === "viewer") {
    return common;
  }

  const storeMenu = [
    { href: "/outbound", label: "Create Outbound" },
    { href: "/approve", label: "Approve Receive" },
  ];

  if (role === "admin") {
    return [...common, ...storeMenu, { href: "/materials", label: "Materials" }];
  }

  return [...common, ...storeMenu];
}

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const menu = user ? getMenuByRole(user.role) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {user ? (
        <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/75 shadow-sm backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-5">
              <Link href="/" className="text-lg font-bold text-slate-800">
                NPS Logistics
              </Link>
              <div className="hidden items-center gap-3 md:flex">
                {menu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 sm:inline-block">
                {user.role}
              </span>
              <span className="hidden text-sm text-slate-600 lg:inline-block">{user.username}</span>
              <LogoutButton />
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-6 pb-4 md:hidden">
            {menu.map((item) => (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                className="whitespace-nowrap rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}

      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
