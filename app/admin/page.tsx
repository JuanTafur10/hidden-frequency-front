import { Suspense } from "react";
import { AdminProductPanel } from "@/features/products/components/admin-product-panel";
import { ReservationList } from "@/features/reservations/components/reservation-list";

export default function AdminPage() {
  return <main className="mx-auto min-h-[75vh] max-w-7xl space-y-14 px-5 py-10 sm:px-8 sm:py-14">
    <header>
      <p className="mb-1 text-xs font-bold uppercase tracking-[.2em] text-accent">Zona privada · Admin</p>
      <h1 className="text-3xl font-black sm:text-4xl">Administración</h1>
      <p className="mt-2 text-muted">Gestiona el catálogo y revisa las solicitudes de reserva.</p>
    </header>
    <AdminProductPanel />
    <Suspense fallback={<p className="text-muted">Cargando solicitudes…</p>}><ReservationList scope="all" /></Suspense>
  </main>;
}
