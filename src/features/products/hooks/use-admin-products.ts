"use client";

import { useCallback, useEffect, useState } from "react";
import { HttpError } from "@/features/common/http";
import { productService } from "../services/product-service";
import type { Product, ProductFilters } from "../domain/product";

const firstPage: ProductFilters = { page: 1, limit: 100 };

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    productService.list(firstPage).then((page) => { if (active) setProducts(page.data); })
      .catch((cause: unknown) => { if (active) setError(cause instanceof HttpError ? cause.message : "No se pudo cargar el inventario."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [revision]);

  const refresh = useCallback(() => { setLoading(true); setError(""); setRevision((value) => value + 1); }, []);
  const create = useCallback(async (input: Omit<Product, "id">) => {
    setSaving(true);
    try { await productService.create(input); refresh(); }
    finally { setSaving(false); }
  }, [refresh]);
  const update = useCallback(async (id: number, input: Partial<Omit<Product, "id">>) => {
    setSaving(true);
    try { await productService.update(id, input); refresh(); }
    finally { setSaving(false); }
  }, [refresh]);
  const remove = useCallback(async (id: number) => {
    setSaving(true);
    try { await productService.remove(id); setProducts((items) => items.filter((item) => item.id !== id)); }
    finally { setSaving(false); }
  }, []);
  const uploadImage = useCallback((file: File) => productService.uploadImage(file), []);

  return { products, loading, error, saving, create, update, remove, uploadImage, refresh };
}
