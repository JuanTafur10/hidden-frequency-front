import { Suspense } from "react";
import { Storefront } from "@/features/storefront/components/storefront";

function StorefrontLoading() {
  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-12 sm:px-8" aria-busy="true">
    <div className="mb-12 h-36 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
    <p className="text-muted">Preparando Hidden Frequency…</p>
  </main>;
}

export default function HomePage() {
  return <Suspense fallback={<StorefrontLoading />}><Storefront /></Suspense>;
}
