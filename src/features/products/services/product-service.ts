import { http } from "@/features/common/http";
import type { Page } from "@/features/common/domain/pagination";
import type { Product, ProductFilters } from "../domain/product";

export const productService = {
  list(filters: ProductFilters) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== "") query.set(key, String(value));
    }
    return http<Page<Product>>(`products?${query.toString()}`);
  }
};