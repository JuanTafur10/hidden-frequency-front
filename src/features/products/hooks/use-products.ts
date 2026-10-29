"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Page } from "@/features/common/domain/pagination";
import { HttpError } from "@/features/common/http";
import { productService } from "../services/product-service";
import type { Product, ProductCategory, ProductFilters } from "../domain/product";

interface ProductsState {
  query: string;
  result?: Page<Product>;
  error?: string;
}

export function useProducts() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [state, setState] = useState<ProductsState>({ query: "" });

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(query);
    const filters: ProductFilters = {
      page: Math.max(1, Number(params.get("page")) || 1),
      limit: 6,
      search: params.get("search") || undefined,
      category: (params.get("category") || undefined) as ProductCategory | undefined,
      minPrice: params.has("minPrice") ? Number(params.get("minPrice")) : undefined,
      maxPrice: params.has("maxPrice") ? Number(params.get("maxPrice")) : undefined
    };

    productService.list(filters)
      .then((result) => { if (active) setState({ query, result }); })
      .catch((error: unknown) => {
        if (!active) return;
        setState({ query, error: error instanceof HttpError ? error.message : "No se pudo cargar el catálogo." });
      });

    return () => { active = false; };
  }, [query]);

  return {
    page,
    result: state.query === query ? state.result : undefined,
    error: state.query === query ? state.error : undefined,
    loading: state.query !== query
  };
}