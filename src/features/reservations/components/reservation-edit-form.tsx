"use client";

import { useState, type FormEvent } from "react";
import type { Reservation, ReservationUpdateInput } from "../domain/reservation";
import { Button } from "@/features/common/components/button";

export function ReservationEditForm({
  reservation,
  busy,
  onSave,
  onCancel
}: {
  reservation: Reservation;
  busy: boolean;
  onSave: (input: ReservationUpdateInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [requestedItem, setRequestedItem] = useState(reservation.requestedItem);
  const [notes, setNotes] = useState(reservation.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    const nextErrors: Record<string, string> = {};
    if (requestedItem.trim().length < 3) nextErrors.requestedItem = "Escribe al menos 3 caracteres.";
    if (requestedItem.trim().length > 240) nextErrors.requestedItem = "El máximo es 240 caracteres.";
    if (notes.trim().length > 1000) nextErrors.notes = "El máximo es 1000 caracteres.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await onSave({ requestedItem: requestedItem.trim(), notes: notes.trim() || null });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo actualizar la reserva.");
    }
  }

  return <form onSubmit={submit} noValidate className="mt-5 space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
    <div>
      <label htmlFor={`reservation-item-${reservation.id}`} className="mb-1 block text-sm font-semibold">Artículo solicitado</label>
      <input id={`reservation-item-${reservation.id}`} value={requestedItem} onChange={(event) => setRequestedItem(event.target.value)} maxLength={240} aria-invalid={Boolean(errors.requestedItem)} aria-describedby={errors.requestedItem ? `reservation-item-error-${reservation.id}` : undefined} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-600" />
      {errors.requestedItem && <p id={`reservation-item-error-${reservation.id}`} role="alert" className="mt-1 text-sm text-rose-600">{errors.requestedItem}</p>}
    </div>
    <div>
      <label htmlFor={`reservation-notes-${reservation.id}`} className="mb-1 block text-sm font-semibold">Notas</label>
      <textarea id={`reservation-notes-${reservation.id}`} value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1000} rows={3} aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? `reservation-notes-error-${reservation.id}` : undefined} className="w-full resize-y rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-600" />
      {errors.notes && <p id={`reservation-notes-error-${reservation.id}`} role="alert" className="mt-1 text-sm text-rose-600">{errors.notes}</p>}
    </div>
    {notice && <p role="alert" className="text-sm text-rose-600">{notice}</p>}
    <div className="flex flex-wrap gap-3">
      <Button type="submit" disabled={busy}>{busy ? "Guardando…" : "Guardar cambios"}</Button>
      <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>Cancelar</Button>
    </div>
  </form>;
}
