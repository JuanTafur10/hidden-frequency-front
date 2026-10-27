"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const { user, loading, logout } = useAuth();
  return <header className="sticky top-0 z-30 bg-zinc-900 px-5 py-4 text-white shadow-lg sm:px-8">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
      <Link href="/" className="text-xl font-black tracking-tight sm:text-2xl">Hidden Frequency</Link>
      <nav aria-label="Navegación principal" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold sm:gap-6">
        <Link href="/#catalogo" className="hover:text-rose-400">Catálogo</Link>
        <Link href="/#reserva" className="hover:text-rose-400">Reserva de Gear</Link>
        <ThemeToggle />
        {loading ? <span aria-label="Comprobando sesión" className="text-zinc-400">…</span> : user ? <>
          <Link href="/mis-reservas" className="hover:text-rose-400">Mis reservas</Link>
          {user.role === "admin" && <Link href="/admin" className="hover:text-rose-400">Administración</Link>}
          <span className="hidden text-zinc-300 md:inline">{user.name}</span>
          <button onClick={() => void logout()} className="rounded border border-zinc-500 px-3 py-1.5 hover:border-rose-400 hover:text-rose-300">Salir</button>
        </> : <Link href="/login" className="rounded border border-zinc-500 px-3 py-1.5 hover:border-rose-400 hover:text-rose-300">Ingresar</Link>}
      </nav>
    </div>
  </header>;
}
