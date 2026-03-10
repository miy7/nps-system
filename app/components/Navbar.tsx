"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  return (
    <nav className="mb-6 bg-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-800">
          NPS Logistics
        </Link>

        <div className="hidden gap-6 font-medium text-gray-600 md:flex">
          <Link href="/" className="transition hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/outbound" className="transition hover:text-blue-600">
            Outbound
          </Link>
          <Link href="/approve" className="transition hover:text-blue-600">
            Approve
          </Link>
          <Link href="/transactions" className="transition hover:text-blue-600">
            Transactions
          </Link>
        </div>

        <LogoutButton />
      </div>
    </nav>
  );
}
