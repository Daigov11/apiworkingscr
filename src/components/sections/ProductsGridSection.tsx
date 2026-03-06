import Link from "next/link";
import { getProductBySlug, listFeaturedProducts } from "@/lib/catalog/client";
import type { CatalogProduct } from "@/lib/catalog/types";
import AddToCartButton from "@/components/catalog/AddToCartButton";

type ProductsGridSource = "slugs" | "featured";

type ProductsGridData = {
  title?: string;
  subtitle?: string;

  source?: ProductsGridSource;   // ✅ nuevo
  productSlugs?: string[];       // slugs opcional ahora
  featuredLimit?: number;        // ✅ nuevo

  showPrice?: boolean;
  showAddToCart?: boolean;
  columns?: 2 | 3 | 4;
};

function colsClass(cols?: number) {
  if (cols === 2) return "sm:grid-cols-2";
  if (cols === 3) return "sm:grid-cols-2 lg:grid-cols-3";
  return "sm:grid-cols-2 lg:grid-cols-4";
}

export default async function ProductsGridSection({ data }: { data: any }) {
  const d = (data || {}) as ProductsGridData;

  const title = d.title || "Nuestros productos destacados";
  const subtitle = d.subtitle || "";
  const showPrice = d.showPrice !== false;
  const showAddToCart = d.showAddToCart !== false;

  // Si no viene source:
  // - si hay slugs => slugs
  // - si no hay slugs => featured
  const source: ProductsGridSource =
    (d.source as ProductsGridSource) ||
    (Array.isArray(d.productSlugs) && d.productSlugs.length ? "slugs" : "featured");

  let products: CatalogProduct[] = [];

  if (source === "featured") {
    const limitRaw = Number(d.featuredLimit ?? 8);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 8;

    products = await listFeaturedProducts(limit);
  } else {
    const slugsRaw = Array.isArray(d.productSlugs) ? d.productSlugs : [];
    const unique = Array.from(
      new Set(slugsRaw.map((s) => String(s || "").trim()).filter(Boolean))
    );

    products = (await Promise.all(unique.map((slug) => getProductBySlug(slug))))
      .filter(Boolean) as CatalogProduct[];
  }

  if (!products.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 text-white">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-6">
          <div className="text-lg font-extrabold">{title}</div>
          <div className="mt-2 text-sm text-neutral-300">
            {source === "featured"
              ? "No hay productos destacados disponibles (featured)."
              : "No hay productos configurados en esta sección (slugs)."}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-white">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-extrabold">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-neutral-300">{subtitle}</p> : null}
        </div>

        <Link className="text-sm text-neutral-300 underline" href="/productos">
          Ver todos →
        </Link>
      </div>

      <div className={`mt-6 grid gap-4 ${colsClass(d.columns)}`}>
        {products.map((p) => (
          <div key={p.id} className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
            <Link href={`/productos/${p.slug}`} className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.mainImageUrl || "https://picsum.photos/seed/empty/800/600"}
                alt={p.name}
                className="h-40 w-full rounded-xl object-cover"
              />
              <div className="mt-3 text-lg font-extrabold">{p.name}</div>
              <div className="mt-1 text-sm text-neutral-300">{p.shortDescription}</div>

              {showPrice ? (
                <div className="mt-2 text-sm font-bold">
                  {p.type === "service" ? "Ver planes" : `S/ ${Number(p.price || 0).toFixed(2)}`}
                </div>
              ) : null}
            </Link>

            {/* Opcional: si quieres que solo los físicos se agreguen al carrito:
                {showAddToCart && p.type === "physical" ? (...) : null}
            */}
            {showAddToCart ? (
              <div className="mt-3">
                <AddToCartButton product={p} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}