import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentAdminSession } from "@/lib/admin-session";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#eee] text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-[#e0d5bf] bg-[#fff8e7]/95 backdrop-blur-sm">
        <div className="h-1 w-full bg-gradient-to-r from-[#fcb040] via-[#d49a2a] to-[#6c1710]" />
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#6c1710]" />
            <div className="space-y-0.5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#a87b51]">Panel Admin</p>
              <h1 className="text-3xl text-[#1a1207]">CasaCerro</h1>
            </div>
          </div>
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] md:gap-3 md:text-sm">
            <Link
              href="/admin/tarifas"
              className="rounded-full border border-transparent px-3 py-2 transition hover:-translate-y-0.5 hover:border-[#e0d5bf] hover:bg-[#f8f1e1] hover:text-[#6c1710]"
            >
              Tarifas
            </Link>
            <Link
              href="/admin/auditoria"
              className="rounded-full border border-transparent px-3 py-2 transition hover:-translate-y-0.5 hover:border-[#e0d5bf] hover:bg-[#f8f1e1] hover:text-[#6c1710]"
            >
              Auditoría
            </Link>
            <form action="/api/admin/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-full border border-[#6c1710] px-4 py-2 text-[#6c1710] transition hover:-translate-y-0.5 hover:bg-[#6c1710] hover:text-white"
              >
                Cerrar sesión
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">{children}</main>
    </div>
  );
}
