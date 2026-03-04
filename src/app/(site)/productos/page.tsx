import Link from "next/link";
import { listCategories, listProducts } from "@/lib/catalog/client";
import AddToCartButton from "@/components/catalog/AddToCartButton";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { cat?: string; q?: string };
}) {
  const cat = searchParams.cat || "";
  const q = searchParams.q || "";

  const categories = await listCategories();
  const { items } = await listProducts({ categorySlug: cat || undefined, search: q || undefined, page: 1, pageSize: 24 });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-white">
      <h1 className="text-3xl font-extrabold">Productos</h1>

      <form className="mt-4 flex gap-2" action="/productos">
        <input type="hidden" name="cat" value={cat} />
        <input
          name="q"
          defaultValue={q}
          className="w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2"
          placeholder="Buscar..."
        />
        <button className="rounded-xl bg-white px-4 py-2 font-bold text-black" type="submit">
          Buscar
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link className={`rounded-full px-3 py-1 text-sm border ${cat ? "border-neutral-800 text-neutral-300" : "border-white text-white"}`} href="/productos">
          Todos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            className={`rounded-full px-3 py-1 text-sm border ${
              cat === c.slug ? "border-white text-white" : "border-neutral-800 text-neutral-300"
            }`}
            href={`/productos?cat=${encodeURIComponent(c.slug)}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
            <Link href={`/productos/${p.slug}`} className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.mainImageUrl || "https://picsum.photos/seed/empty/800/600"}
                alt={p.name}
                className="h-44 w-full rounded-xl object-cover"
              />
              <div className="mt-3 text-lg font-extrabold">{p.name}</div>
              <div className="mt-1 text-sm text-neutral-300">{p.shortDescription}</div>

              <div className="mt-2 text-sm font-bold">
                {p.type === "service" ? "Ver planes" : `S/ ${Number(p.price || 0).toFixed(2)}`}
              </div>
            </Link>

            <div className="mt-3">
              <AddToCartButton product={p} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}