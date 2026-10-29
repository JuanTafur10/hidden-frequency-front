"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/features/products/domain/product";
import { CatalogSection } from "@/features/products/components/catalog-section";
import { ReservationForm } from "@/features/reservations/components/reservation-form";

export function Storefront() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchParams = useSearchParams();
  const initialItem = searchParams.get("requestedItem") ?? "";

  function chooseProduct(product: Product) {
    setSelectedProduct(product);
    document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return <>
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <section className="mb-16 border-l-4 border-accent py-4 pl-5 sm:pl-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-accent">Hidden Frequency · Música para escuchar distinto</p>
        <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">Vinilos underground, pedales y equipo de producción</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">Una selección para músicos, coleccionistas y personas que buscan un sonido propio.</p>
      </section>
      <CatalogSection onReserve={chooseProduct} />
      <ReservationForm key={`${selectedProduct?.id ?? "custom"}-${initialItem}`} product={selectedProduct} initialItem={initialItem} />
    </main>
    <footer className="bg-zinc-900 px-6 py-8 text-center text-sm text-zinc-300">© 2026 Hidden Frequency, todos los derechos reservados.</footer>
  </>;
}
