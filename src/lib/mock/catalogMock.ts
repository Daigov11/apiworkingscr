import type { CatalogCategory, CatalogPlan, CatalogProduct, ListProductsArgs, ListProductsResult } from "@/lib/catalog/types";

const categories: CatalogCategory[] = [
  { id: 1, name: "Ticketeras", slug: "ticketeras", description: "Impresoras térmicas y ticketeras.", status: "published" },
  { id: 2, name: "Rollos", slug: "rollos", description: "Rollos térmicos y accesorios.", status: "published" },
  { id: 3, name: "Sistemas", slug: "sistemas", description: "Planes de sistemas y soluciones.", status: "published" },
  { id: 4, name: "Packs", slug: "packs", description: "Combos y packs especiales.", status: "published" },
];

const systemPlans: CatalogPlan[] = [
  {
    id: 101,
    productId: 1000,
    name: "Plan Básico",
    price: 99,
    currency: "PEN",
    features: ["1 módulo incluido", "Soporte básico", "Actualizaciones"],
    isDefault: true,
    sortOrder: 1,
    status: "published",
  },
  {
    id: 102,
    productId: 1000,
    name: "Plan Pro",
    price: 199,
    currency: "PEN",
    features: ["3 módulos incluidos", "Soporte prioritario", "Reportes avanzados"],
    isDefault: false,
    sortOrder: 2,
    status: "published",
  },
];

const products: CatalogProduct[] = [
  {
    id: 11,
    categorySlug: "ticketeras",
    name: "Ticketera Térmica 80mm",
    slug: "ticketera-termica-80mm",
    type: "physical",
    status: "published",
    shortDescription: "Impresión rápida para negocios.",
    description: "Ticketera térmica 80mm ideal para restaurantes y tiendas.",
    currency: "PEN",
    price: 350,
    mainImageUrl: "https://picsum.photos/seed/ticketera/800/600",
    ogImage: "https://picsum.photos/seed/ticketera-og/1200/630",
    metaTitle: "Ticketera Térmica 80mm | ApiWorking",
    metaDescription: "Compra ticketera térmica 80mm: rápida, compatible y lista para tu negocio.",
    isFeatured: true,
  },
  {
    id: 21,
    categorySlug: "rollos",
    name: "Rollo Térmico 80mm",
    slug: "rollo-termico-80mm",
    type: "physical",
    status: "published",
    shortDescription: "Rollo térmico de alta calidad.",
    description: "Rollo térmico 80mm para ticketeras. Ideal para alto volumen.",
    currency: "PEN",
    price: 25,
    mainImageUrl: "https://picsum.photos/seed/rollo/800/600",
    ogImage: "https://picsum.photos/seed/rollo-og/1200/630",
    metaTitle: "Rollo Térmico 80mm | ApiWorking",
    metaDescription: "Rollo térmico 80mm para ticketeras. Excelente impresión y durabilidad.",
    isFeatured: true,
  },
  {
    id: 1000,
    categorySlug: "sistemas",
    name: "Sistema ApiWorking POS",
    slug: "sistema-apiworking-pos",
    type: "service",
    status: "published",
    shortDescription: "Sistema para ventas y operaciones.",
    description: "Sistema POS con módulos configurables según plan.",
    currency: "PEN",
    price: null,
    mainImageUrl: "https://picsum.photos/seed/sistema/800/600",
    ogImage: "https://picsum.photos/seed/sistema-og/1200/630",
    metaTitle: "Sistema POS | ApiWorking",
    metaDescription: "Elige tu plan para tu negocio: básico, pro o completo.",
    isFeatured: true,
    plans: systemPlans,
  },
  {
    id: 41,
    categorySlug: "packs",
    name: "Pack Ticketera + Rollos",
    slug: "pack-ticketera-rollos",
    type: "physical",
    status: "published",
    shortDescription: "Combo listo para trabajar.",
    description: "Incluye una ticketera térmica y 10 rollos.",
    currency: "PEN",
    price: 520,
    compareAtPrice: 580,
    mainImageUrl: "https://picsum.photos/seed/pack/800/600",
    ogImage: "https://picsum.photos/seed/pack-og/1200/630",
    metaTitle: "Pack Ticketera + Rollos | ApiWorking",
    metaDescription: "Ahorra con el pack: ticketera y rollos listos para tu negocio.",
    isFeatured: false,
  },
];

function normalize(s: string) {
  return (s || "").toLowerCase().trim();
}

export async function mockListCategories(): Promise<CatalogCategory[]> {
  return categories.filter((c) => c.status === "published");
}

export async function mockListProducts(args: ListProductsArgs): Promise<ListProductsResult> {
  const page = args.page && args.page > 0 ? args.page : 1;
  const pageSize = args.pageSize && args.pageSize > 0 ? args.pageSize : 12;

  let list = products.filter((p) => p.status === "published");

  if (args.categorySlug) list = list.filter((p) => p.categorySlug === args.categorySlug);
  if (args.featured) list = list.filter((p) => !!p.isFeatured);

  if (args.search) {
    const q = normalize(args.search);
    list = list.filter((p) => normalize(p.name).includes(q) || normalize(p.slug).includes(q));
  }

  const sort = args.sort || "newest";
  if (sort === "name_asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "price_asc") list = [...list].sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
  if (sort === "price_desc") list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  // newest: dejamos como está (mock)

  const total = list.length;
  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize);

  return { items, total };
}

export async function mockGetProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const s = normalize(slug);
  const found = products.find((p) => normalize(p.slug) === s && p.status === "published");
  return found || null;
}