import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog/client";
import PlanPicker from "@/components/catalog/PlanPicker";
import AddToCartButton from "@/components/catalog/AddToCartButton";

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-white">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.mainImageUrl || "https://picsum.photos/seed/empty/800/600"}
            alt={product.name}
            className="h-[360px] w-full rounded-xl object-cover"
          />
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-6">
          <h1 className="text-3xl font-extrabold">{product.name}</h1>
          <p className="mt-2 text-neutral-300">{product.description}</p>

          <div className="mt-4 text-lg font-extrabold">
            {product.type === "service" ? "Elige un plan" : `S/ ${Number(product.price || 0).toFixed(2)}`}
          </div>

          <div className="mt-4">
            {product.type === "service" ? (
              <PlanPicker product={product} />
            ) : (
              <AddToCartButton product={product} />
            )}
          </div>

          <a
            href="/productos"
            className="mt-4 inline-block text-sm text-neutral-300 underline"
          >
            ← Volver a productos
          </a>
        </div>
      </div>
    </main>
  );
}