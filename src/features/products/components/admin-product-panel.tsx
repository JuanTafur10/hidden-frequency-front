"use client";

import { useState } from "react";
import type { Product } from "../domain/product";
import { useAdminProducts } from "../hooks/use-admin-products";
import { AdminProductForm } from "./admin-product-form";

export function AdminProductPanel() {
  const { products, loading, error, saving, create, update, remove, uploadImage, refresh } = useAdminProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [actionError, setActionError] = useState("");

  async function save(draft: Omit<Product, "id">) {
    setActionError("");
    if (editing) await update(editing.id, draft);
    else await create(draft);
    setEditing(null);
  }

  async function confirmDelete(product: Product) {
    if (!window.confirm(`¿Seguro que quieres eliminar “${product.title}”? Esta acción no se puede deshacer.`)) return;
    setActionError("");
    try { await remove(product.id); }
    catch (cause) { setActionError(cause instanceof Error ? cause.message : "No se pudo eliminar el producto."); }
  }

  return <section className="space-y-8">
    <div className="grid gap-8 lg:grid-cols-[minmax(280px,1fr)_minmax(0,1.4fr)] lg:items-start">
      <AdminProductForm key={editing?.id ?? "new-product"} product={editing} busy={saving} onSave={save} onCancel={() => setEditing(null)} uploadImage={uploadImage} />
      <div>
        <h2 className="mb-4 text-xl font-bold">Productos del catálogo</h2>
        {actionError && <p role="alert" className="mb-4 rounded-lg bg-rose-100 p-3 text-sm text-rose-900">{actionError}</p>}
        {loading ? <p aria-live="polite" className="rounded-xl bg-surface p-6 text-muted">Cargando productos…</p> : error ? <div role="alert" className="rounded-xl bg-surface p-6">
          <p className="text-rose-700">{error}</p><button onClick={refresh} className="mt-3 font-bold text-accent">Intentar de nuevo</button>
        </div> : !products.length ? <p className="rounded-xl bg-surface p-6 text-muted">No hay productos cargados.</p> : <ul className="space-y-3">
          {products.map((product) => <ProductRow key={product.id} product={product} busy={saving} onEdit={() => setEditing(product)} onDelete={() => void confirmDelete(product)} />)}
        </ul>}
      </div>
    </div>
  </section>;
}

function ProductRow({ product, busy, onEdit, onDelete }: { product: Product; busy: boolean; onEdit: () => void; onDelete: () => void }) {
  const image = product.imageUrl.startsWith("assets/") ? `/${product.imageUrl}` : product.imageUrl;
  return <li className="flex gap-4 rounded-xl bg-surface p-3 shadow-sm sm:p-4">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={image} alt="" loading="lazy" className="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24" />
    <div className="min-w-0 flex-1">
      <p className="text-xs font-bold uppercase tracking-widest text-accent">{product.category}</p>
      <h3 className="truncate font-bold">{product.title}</h3>
      <p className="text-sm text-muted">${new Intl.NumberFormat("es-CO").format(product.price)} COP</p>
      <div className="mt-2 flex gap-3 text-sm font-semibold">
        <button type="button" onClick={onEdit} disabled={busy} className="text-zinc-700 hover:text-accent dark:text-zinc-200">Editar</button>
        <button type="button" onClick={onDelete} disabled={busy} className="text-rose-700 hover:underline disabled:opacity-50">Eliminar</button>
      </div>
    </div>
  </li>;
}
