export type ProductCategory = "Vinilos" | "Pedales" | "Instrumentos";

export interface Product {
  id: number;
  title: string;
  category: ProductCategory;
  price: number;
  description: string;
  imageUrl: string;
}

export interface ProductFilters {
  page: number;
  limit: number;
  search?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
}