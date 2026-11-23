"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <header className="bg-ivory border-b border-zinc-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-forest text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            B
          </span>
          <div>
            <span className="text-sm font-bold tracking-tight text-dark block leading-none">
              Belbin Assessment
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              Self-Perception Inventory
            </span>
          </div>
        </Link>

        {/* Tombol Panel Admin hanya muncul jika tidak sedang di halaman admin/login */}
        {!isAdminRoute ? (
          <Link
            href="/admin"
            className="text-xs font-semibold text-zinc-700 hover:text-forest px-3.5 py-1.5 rounded-lg border border-zinc-300/90 bg-white hover:bg-forest-light/30 hover:border-forest/40 active:bg-zinc-100 transition shadow-2xs flex items-center space-x-1.5"
          >
            <span>Panel Admin</span>
          </Link>
        ) : pathname === "/admin/login" ? (
          <Link
            href="/"
            className="text-xs font-semibold text-zinc-500 hover:text-forest transition flex items-center space-x-1"
          >
            <span>← Kembali ke Beranda</span>
          </Link>
        ) : null}
      </div>
    </header>
  );
}

