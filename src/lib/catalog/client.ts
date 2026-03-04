import type { CatalogCategory, CatalogProduct, ListProductsArgs, ListProductsResult } from "@/lib/catalog/types";
import { mockGetProductBySlug, mockListCategories, mockListProducts } from "@/lib/mock/catalogMock";

export async function listCategories(): Promise<CatalogCategory[]> {
  // Luego: reemplazas por fetch a James
  return mockListCategories();
}

export async function listProducts(args: ListProductsArgs): Promise<ListProductsResult> {
  // Luego: reemplazas por fetch a James
  return mockListProducts(args);
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  // Luego: reemplazas por fetch a James
  return mockGetProductBySlug(slug);
}