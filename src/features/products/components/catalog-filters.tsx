"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = ["Todos", "Vinilos", "Pedales", "Instrumentos"] as const;

export function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useSearchParams();
  const [priceError, setPriceError] = useState("");
  const currentCategory = current.get("category") ?? "Todos";

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPriceError("");
    const values = new FormData(event.currentTarget);
    const minPrice = String(values.get("minPrice") ?? "").trim();
    const maxPrice = String(values.get("maxPrice") ?? "").trim();
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setPriceError("El precio mínimo no puede superar el máximo.");
      return;
    }

    const query = new URLSearchParams();
    const search = String(values.get("search") ?? "").trim();
    const category = String(values.get("category") ?? "Todos");
    if (search) query.set("search", search);
    if (category !== "Todos") query.set("category", category);
    if (minPrice) query.set("minPrice", minPrice);
    if (maxPrice) query.set("maxPrice", maxPrice);
    const suffix = query.size ? `?${query.toString()}` : "";
    router.push(`${pathname}${suffix}#catalogo`, { scroll: false });
  }

  return <form key={current.toString()} onSubmit={apply} className="mb-8 rounded-xl bg-surface p-4 shadow-sm sm:p-5">
    <input type="hidden" name="category" value={currentCategory} />
    <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
      {categories.map((category) => <button key={category} type="button"
        onClick={(event) => {
          event.preventDefault();
          const form = event.currentTarget.form;
          if (!form) return;
          const data = new FormData(form);
          data.set("category", category);
          const search = String(data.get("search") ?? "").trim();
          const min = String(data.get("minPrice") ?? "").trim();
          const max = String(data.get("maxPrice") ?? "").trim();
          const query = new URLSearchParams();
          if (search) query.set("search", search);
          if (category !== "Todos") query.set("category", category);
          if (min) query.set("minPrice", min);
          if (max) query.set("maxPrice", max);
          router.push(`${pathname}?${query.toString()}#catalogo`, { scroll: false });
        }} aria-pressed={currentCategory === category}
        className={`rounded-full border px-4 py-2 text-sm font-bold transition ${currentCategory === category ? "border-accent bg-accent text-white" : "border-zinc-300 hover:border-accent dark:border-zinc-600"}`}>{category}</button>)}
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(200px,2fr)_1fr_1fr_auto] lg:items-end">
      <label className="text-sm font-semibold">Buscar
        <input name="search" defaultValue={current.get("search") ?? ""} placeholder="Artista, equipo o nombre" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 font-normal dark:border-zinc-600" />
      </label>
      <label className="text-sm font-semibold">Precio mínimo
        <input name="minPrice" type="number" min="1" defaultValue={current.get("minPrice") ?? ""} placeholder="Desde" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 font-normal dark:border-zinc-600" />
      </label>
      <label className="text-sm font-semibold">Precio máximo
        <input name="maxPrice" type="number" min="1" defaultValue={current.get("maxPrice") ?? ""} placeholder="Hasta" className="mt-1 block w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 font-normal dark:border-zinc-600" />
      </label>
      <button type="submit" className="rounded-lg bg-zinc-900 px-5 py-3 font-bold text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Aplicar filtros</button>
    </div>
    {priceError && <p role="alert" className="mt-3 text-sm text-rose-600">{priceError}</p>}
  </form>;
}
