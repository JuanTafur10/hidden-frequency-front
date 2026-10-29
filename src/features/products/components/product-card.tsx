import type { Product } from "../domain/product";

const formatPrice = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

export function ProductCard({ product, onReserve }: { product: Product; onReserve: (product: Product) => void }) {
  const image = product.imageUrl.startsWith("assets/") ? `/${product.imageUrl}` : product.imageUrl;
  return <article className="flex h-full flex-col rounded-xl bg-surface p-4 shadow-md transition hover:-translate-y-1 hover:shadow-xl sm:p-5">
    {/* La API devuelve imágenes locales o enlaces seguros de Cloudinary. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={image} alt={product.title} loading="lazy" className="mb-4 aspect-square w-full rounded-lg object-cover" />
    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">{product.category}</p>
    <h3 className="text-lg font-bold leading-snug">{product.title}</h3>
    <p className="my-2 flex-1 text-sm text-muted">{product.description}</p>
    <p className="mb-4 text-xl font-extrabold text-accent">{formatPrice.format(product.price)}</p>
    <button type="button" onClick={() => onReserve(product)} aria-label={`Solicitar ${product.title}`} className="w-full rounded-lg bg-accent px-4 py-3 font-bold text-white transition hover:bg-rose-700">Lo quiero</button>
  </article>;
}
