"use client";

import { useState, type FormEvent } from "react";
import { HttpError } from "@/features/common/http";
import type { Product, ProductCategory } from "../domain/product";

type ProductDraft = Omit<Product, "id">;

export function AdminProductForm({ product, busy, onSave, onCancel, uploadImage }: {
  product: Product | null;
  busy: boolean;
  onSave: (draft: ProductDraft) => Promise<void>;
  onCancel: () => void;
  uploadImage: (file: File) => Promise<{ data: { imageUrl: string } }>;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const title = String(values.get("title") ?? "").trim();
    const category = String(values.get("category") ?? "") as ProductCategory;
    const price = Number(values.get("price"));
    const description = String(values.get("description") ?? "").trim();
    let imageUrl = String(values.get("imageUrl") ?? "").trim();
    const file = values.get("imageFile");
    const nextErrors: Record<string, string> = {};
    if (title.length < 2) nextErrors.title = "El nombre debe tener al menos 2 caracteres.";
    if (!["Vinilos", "Pedales", "Instrumentos"].includes(category)) nextErrors.category = "Selecciona una categoría.";
    if (!Number.isFinite(price) || price <= 0) nextErrors.price = "Ingresa un precio mayor que cero.";
    if (description.length < 5) nextErrors.description = "La descripción debe tener al menos 5 caracteres.";
    if (!imageUrl && !(file instanceof File && file.size)) nextErrors.imageUrl = "Indica una ruta o selecciona una imagen.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }

    setErrors({});
    setNotice("");
    try {
      if (file instanceof File && file.size) {
        setUploading(true);
        imageUrl = (await uploadImage(file)).data.imageUrl;
      }
      await onSave({ title, category, price, description, imageUrl });
      setNotice(product ? "Producto actualizado." : "Producto creado.");
      if (!product) form.reset();
    } catch (error) {
      if (error instanceof HttpError) {
        const fieldErrors = { ...error.fields };
        if (file instanceof File && file.size && !Object.keys(fieldErrors).length) fieldErrors.imageFile = error.message;
        if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
        else setNotice(error.message);
      }
      else setNotice(error instanceof Error ? error.message : "No se pudo guardar el producto.");
    } finally { setUploading(false); }
  }

  return <form onSubmit={submit} noValidate className="space-y-4 rounded-xl bg-surface p-5 shadow-sm">
    <h2 className="text-xl font-bold">{product ? "Editar producto" : "Agregar producto"}</h2>
    {notice && <p role="status" className="text-sm text-muted">{notice}</p>}
    <Field name="title" label="Nombre" error={errors.title} defaultValue={product?.title} />
    <div><label htmlFor="category" className="mb-1 block text-sm font-semibold">Categoría</label>
      <select id="category" name="category" defaultValue={product?.category ?? "Vinilos"} aria-invalid={Boolean(errors.category)} className="w-full rounded-lg border border-zinc-300 bg-background px-3 py-2 dark:border-zinc-600">
        <option>Vinilos</option><option>Pedales</option><option>Instrumentos</option>
      </select>{errors.category && <FieldError message={errors.category} />}</div>
    <Field name="price" label="Precio en pesos colombianos" type="number" error={errors.price} defaultValue={product?.price} />
    <div><label htmlFor="description" className="mb-1 block text-sm font-semibold">Descripción</label>
      <textarea id="description" name="description" rows={3} minLength={5} maxLength={1000} defaultValue={product?.description} aria-invalid={Boolean(errors.description)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-600" />
      {errors.description && <FieldError message={errors.description} />}</div>
    <Field name="imageUrl" label="Ruta o URL de imagen" error={errors.imageUrl} defaultValue={product?.imageUrl} />
    <div><label htmlFor="imageFile" className="mb-1 block text-sm font-semibold">O subir una imagen (JPG, PNG o WebP; hasta 5 MB)</label>
      <input id="imageFile" name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-200 file:px-4 file:py-2 dark:file:bg-zinc-700" />
      {uploading && <p aria-live="polite" className="mt-1 text-sm text-muted">Subiendo imagen…</p>}</div>
      {errors.imageFile && <FieldError message={errors.imageFile} />}
    <div className="flex flex-wrap gap-3">
      <button disabled={busy || uploading} className="rounded-lg bg-accent px-5 py-2.5 font-bold text-white disabled:opacity-60">{busy || uploading ? "Guardando…" : product ? "Guardar cambios" : "Crear producto"}</button>
      {product && <button type="button" onClick={onCancel} className="rounded-lg border border-zinc-300 px-5 py-2.5 font-bold dark:border-zinc-600">Cancelar</button>}
    </div>
  </form>;
}

function Field({ name, label, type = "text", error, defaultValue }: { name: string; label: string; type?: string; error?: string; defaultValue?: string | number }) {
  return <div><label htmlFor={name} className="mb-1 block text-sm font-semibold">{label}</label>
    <input id={name} name={name} type={type} required defaultValue={defaultValue} min={type === "number" ? "1" : undefined} aria-invalid={Boolean(error)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-600" />
    {error && <FieldError message={error} />}</div>;
}

function FieldError({ message }: { message: string }) { return <p role="alert" className="mt-1 text-sm text-rose-600">{message}</p>; }
