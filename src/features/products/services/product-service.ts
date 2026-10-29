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
  },
  create(input: Omit<Product, "id">) {
    return http<{ data: Product }>("products", { method: "POST", body: JSON.stringify(input) });
  },
  update(id: number, input: Partial<Omit<Product, "id">>) {
    return http<{ data: Product }>(`products/${id}`, { method: "PUT", body: JSON.stringify(input) });
  },
  remove(id: number) {
    return http<void>(`products/${id}`, { method: "DELETE" });
  },
  uploadImage(file: File) {
    const body = new FormData();
    body.set("image", file);
    return http<{ data: { imageUrl: string } }>("uploads/products", { method: "POST", body });
  }
};
