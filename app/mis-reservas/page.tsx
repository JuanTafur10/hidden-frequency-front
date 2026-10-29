import { Suspense } from "react";
import { ReservationList } from "@/features/reservations/components/reservation-list";

export default function MyReservationsPage() {
  return <main className="mx-auto min-h-[75vh] max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
    <Suspense fallback={<p className="text-muted">Cargando mis reservas…</p>}><ReservationList scope="mine" /></Suspense>
  </main>;
}
