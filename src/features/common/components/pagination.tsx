"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Pagination({ page, totalPages, label = "Páginas del catálogo", anchor = "catalogo" }: { page: number; totalPages: number; label?: string; anchor?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(nextPage: number) {
    const query = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) query.delete("page");
    else query.set("page", String(nextPage));
    const suffix = query.size ? `?${query.toString()}` : "";
    router.push(`${pathname}${suffix}#${anchor}`, { scroll: false });
  }

  if (totalPages <= 1) return null;
  return <nav aria-label={label} className="mt-10 flex items-center justify-center gap-4">
    <button type="button" onClick={() => navigate(page - 1)} disabled={page <= 1} className="rounded-lg border border-zinc-300 px-4 py-2 font-semibold disabled:opacity-40 dark:border-zinc-600">Anterior</button>
    <span aria-live="polite" className="text-sm text-muted">Página {page} de {totalPages}</span>
    <button type="button" onClick={() => navigate(page + 1)} disabled={page >= totalPages} className="rounded-lg border border-zinc-300 px-4 py-2 font-semibold disabled:opacity-40 dark:border-zinc-600">Siguiente</button>
  </nav>;
}
