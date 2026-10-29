"use client";

import type { Product } from "../domain/product";
import { useProducts } from "../hooks/use-products";
import { CatalogFilters } from "./catalog-filters";
import { ProductCard } from "./product-card";
import { Pagination } from "@/features/common/components/pagination";

export function CatalogSection({ onReserve }: { onReserve: (product: Product) => void }) {
  const { result, error, loading } = useProducts();
  return <section id="catalogo" className="mb-16 scroll-mt-28">
    <div className="mb-5">
      <p className="mb-1 text-xs font-bold uppercase tracking-[.2em] text-accent">Selección independiente</p>
      <h2 className="text-2xl font-black sm:text-3xl">Catálogo de equipos y vinilos</h2>
      <p className="mt-2 text-muted">Encuentra una pieza para tu colección o tu próximo sonido.</p>
    </div>
    <CatalogFilters />
    {loading ? <div aria-live="polite" aria-busy="true" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => <div key={index} className="animate-pulse rounded-xl bg-surface p-4 shadow-sm">
        <div className="mb-4 aspect-square rounded-lg bg-zinc-200 dark:bg-zinc-700" /><div className="mb-2 h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" /><div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>)}
      <p className="sr-only">Cargando productos…</p>
    </div> : error ? <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-6 text-rose-900 dark:bg-rose-950 dark:text-rose-100">
      <h3 className="font-bold">No pudimos cargar el catálogo</h3><p className="mt-1">{error}</p>
      <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-accent px-4 py-2 font-bold text-white">Intentar de nuevo</button>
    </div> : !result?.data.length ? <p className="rounded-xl bg-surface p-8 text-center text-muted">No encontramos productos con esos filtros. Prueba con otra búsqueda.</p> : <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.map((product) => <ProductCard key={product.id} product={product} onReserve={onReserve} />)}
      </div>
      <Pagination page={result.pagination.page} totalPages={result.pagination.totalPages} />
    </>}
  </section>;
}
