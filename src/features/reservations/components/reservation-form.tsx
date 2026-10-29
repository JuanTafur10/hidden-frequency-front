"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { HttpError } from "@/features/common/http";
import { reservationService } from "../services/reservation-service";
import type { Product } from "@/features/products/domain/product";

export function ReservationForm({ product, initialItem = "" }: { product: Product | null; initialItem?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setErrors({});
    setNotice("");
    const values = new FormData(event.currentTarget);
    const requestedItem = String(values.get("requestedItem") ?? "").trim();
    const notes = String(values.get("notes") ?? "").trim();
    const nextErrors: Record<string, string> = {};
    if (requestedItem.length < 3) nextErrors.requestedItem = "Indica qué vinilo o equipo buscas (mínimo 3 caracteres).";
    if (notes.length > 1000) nextErrors.notes = "La nota no puede superar 1000 caracteres.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    if (!user) {
      const destination = `/?requestedItem=${encodeURIComponent(requestedItem)}#reserva`;
      router.push(`/login?next=${encodeURIComponent(destination)}`);
      return;
    }

    setBusy(true);
    try {
      await reservationService.create({ productId: product?.id, requestedItem, notes: notes || undefined });
      setNotice("¡Solicitud enviada! Ya puedes verla en Mis reservas.");
      form.reset();
    } catch (error) {
      if (error instanceof HttpError) setErrors({ ...error.fields, ...(error.status === 404 ? { requestedItem: error.message } : {}) });
      else setNotice("No fue posible enviar la solicitud. Intenta de nuevo.");
    } finally { setBusy(false); }
  }

  return <section id="reserva" className="scroll-mt-28">
    <div className="mb-5">
      <p className="mb-1 text-xs font-bold uppercase tracking-[.2em] text-accent">¿No encuentras lo que buscas?</p>
      <h2 className="text-2xl font-black sm:text-3xl">Reserva bajo pedido</h2>
      <p className="mt-2 max-w-2xl text-muted">¿Buscas una edición específica o un pedal difícil de conseguir? Déjanos los detalles y revisaremos disponibilidad.</p>
    </div>
    <form onSubmit={submit} noValidate className="max-w-2xl space-y-5 rounded-xl bg-surface p-5 shadow-sm sm:p-8">
      {notice && <p role="status" className="rounded-lg bg-emerald-100 p-3 text-sm text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">{notice}</p>}
      <div>
        <label htmlFor="requestedItem" className="mb-1.5 block text-sm font-semibold">¿Qué vinilo o equipo buscas?</label>
        <input key={product?.id ?? initialItem} id="requestedItem" name="requestedItem" defaultValue={product?.title ?? initialItem} required minLength={3} maxLength={240} aria-invalid={Boolean(errors.requestedItem)} aria-describedby={errors.requestedItem ? "requestedItem-error" : undefined} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none focus:border-accent dark:border-zinc-600" />
        {errors.requestedItem && <p id="requestedItem-error" role="alert" className="mt-1 text-sm text-rose-600">{errors.requestedItem}</p>}
      </div>
      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold">Notas adicionales <span className="font-normal text-muted">(opcional)</span></label>
        <textarea id="notes" name="notes" rows={4} maxLength={1000} aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? "notes-error" : undefined} placeholder="Cuéntanos qué edición, color o condición prefieres." className="w-full resize-y rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none focus:border-accent dark:border-zinc-600" />
        {errors.notes && <p id="notes-error" role="alert" className="mt-1 text-sm text-rose-600">{errors.notes}</p>}
      </div>
      <button disabled={busy} className="rounded-lg bg-accent px-6 py-3 font-bold text-white hover:bg-rose-700 disabled:opacity-60">{busy ? "Enviando…" : user ? "Enviar solicitud" : "Inicia sesión para enviar"}</button>
      {!user && <p className="text-sm text-muted">Para guardar tu solicitud necesitas una cuenta. Al continuar volverás aquí con el artículo que escribiste.</p>}
    </form>
  </section>;
}
