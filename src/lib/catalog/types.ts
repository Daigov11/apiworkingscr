export type CatalogCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  status: "draft" | "published";
};

export type CatalogPlan = {
  id: number;
  productId: number;
  name: string;
  price: number;
  currency: string; // "PEN"
  features?: string[];
  isDefault?: boolean;
  sortOrder?: number;
  status?: "draft" | "published";
};

export type CatalogProduct = {
  id: number;
  categorySlug: string;

  name: string;
  slug: string;
  type: "physical" | "service"; // service = Sistemas
  status: "draft" | "published";

  shortDescription?: string | null;
  description?: string | null;

  currency: string; // "PEN"
  price?: number | null; // para physical
  compareAtPrice?: number | null;

  mainImageUrl?: string | null;
  ogImage?: string | null;

  metaTitle?: string | null;
  metaDescription?: string | null;

  isFeatured?: boolean;
  images?: string[];
  category?: CatalogProductCategory;
  // solo para sistemas
  plans?: CatalogPlan[];
};

export type ListProductsArgs = {
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
};

export type ListProductsResult = {
  items: CatalogProduct[];
  total: number;
};
export type CatalogProductCategory = {
  name: string;
  slug: string;
};