"use client";

import { useState } from "react";
import { useReservations } from "../hooks/use-reservations";
import type { Reservation, ReservationUpdateInput } from "../domain/reservation";
import { Pagination } from "@/features/common/components/pagination";
import { Button } from "@/features/common/components/button";
import { ReservationEditForm } from "./reservation-edit-form";

const dateFormat = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" });

export function ReservationList({ scope = "mine" }: { scope?: "mine" | "all" }) {
  const { result, error, loading, update, remove } = useReservations(scope);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const heading = scope === "mine" ? "Mis reservas" : "Solicitudes recibidas";
  const anchor = scope === "mine" ? "mis-reservas" : "solicitudes";

  async function saveReservation(id: string, input: ReservationUpdateInput) {
    setBusyId(id);
    setActionError("");
    try {
      await update(id, input);
      setEditingId(null);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteReservation(reservation: Reservation) {
    if (!window.confirm(`¿Seguro que quieres eliminar la solicitud “${reservation.requestedItem}”? Esta acción no se puede deshacer.`)) return;
    setBusyId(reservation.id);
    setActionError("");
    try {
      await remove(reservation.id);
      if (editingId === reservation.id) setEditingId(null);
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "No se pudo eliminar la reserva.");
    } finally {
      setBusyId(null);
    }
  }

  return <section id={anchor} className="scroll-mt-28">
    <div className="mb-6">
      <p className="mb-1 text-xs font-bold uppercase tracking-[.2em] text-accent">Hidden Frequency</p>
      <h1 className="text-3xl font-black">{heading}</h1>
      <p className="mt-2 text-muted">{scope === "mine" ? "Aquí puedes consultar las solicitudes que has enviado." : "Solicitudes de reserva registradas por los clientes."}</p>
    </div>
    {actionError && <p role="alert" className="mb-4 rounded-lg bg-rose-100 p-3 text-sm text-rose-900 dark:bg-rose-950 dark:text-rose-100">{actionError}</p>}
    {loading ? <div aria-live="polite" aria-busy="true" className="space-y-4">
      {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-xl bg-surface shadow-sm" />)}
      <p className="sr-only">Cargando reservas…</p>
    </div> : error ? <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-6 text-rose-900 dark:bg-rose-950 dark:text-rose-100">
      <p className="font-bold">No pudimos cargar tus reservas</p><p className="mt-1">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-accent px-4 py-2 font-bold text-white">Intentar de nuevo</button>
    </div> : !result?.data.length ? <p className="rounded-xl bg-surface p-8 text-center text-muted">Todavía no hay solicitudes para mostrar.</p> : <>
      <ul className="space-y-4">
        {result.data.map((reservation) => <li key={reservation.id} className="rounded-xl bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-widest text-accent">{reservation.status}</p>
              <h2 className="mt-1 text-lg font-bold">{reservation.requestedItem}</h2>
              {reservation.product && <p className="mt-1 text-sm text-muted">Producto del catálogo: {reservation.product.title}</p>}
              {reservation.notes && <p className="mt-3 text-sm">{reservation.notes}</p>}
            </div>
            <time dateTime={reservation.createdAt} className="text-sm text-muted">{dateFormat.format(new Date(reservation.createdAt))}</time>
          </div>
          {scope === "all" && reservation.user && <p className="mt-4 border-t border-zinc-200 pt-3 text-sm text-muted dark:border-zinc-700">Solicitante: {reservation.user.name} · {reservation.user.email}</p>}
          {editingId === reservation.id ? <ReservationEditForm reservation={reservation} busy={busyId === reservation.id} onSave={(input) => saveReservation(reservation.id, input)} onCancel={() => setEditingId(null)} /> : <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" disabled={busyId !== null} onClick={() => { setActionError(""); setEditingId(reservation.id); }}>Editar solicitud</Button>
            <Button type="button" variant="danger" disabled={busyId !== null} onClick={() => void deleteReservation(reservation)}>Eliminar solicitud</Button>
          </div>}
        </li>)}
      </ul>
      <Pagination page={result.pagination.page} totalPages={result.pagination.totalPages} label={`Páginas: ${heading.toLowerCase()}`} anchor={anchor} />
    </>}
  </section>;
}
