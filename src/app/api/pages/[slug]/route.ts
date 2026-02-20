import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // ✅ ahora sí

  if (slug === "sistema-de-restaurantes") {
    return NextResponse.json({
      slug: "sistema-de-restaurantes",
      metaTitle: "Sistema de Restaurantes | ApiWorking",
      metaDescription: "Controla ventas, mesas, comandas y pagos con ApiWorking.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        {
          id: "s1",
          type: "hero",
          data: {
            title: "Sistema de Restaurantes",
            subtitle: "Ventas + Mesas + Comandas + Pagos",
            ctaText: "Solicitar demo",
            ctaHref: "/contacto",
          },
        },
        {
          id: "s2",
          type: "text",
          data: { title: "¿Qué incluye?", text: "Módulos listos: ventas, reportes, mozo, caja." },
        },
        {
          id: "s3",
          type: "reviews",
          data: { title: "Opiniones", items: [{ name: "Carlos", text: "Me ordenó el negocio." }] },
        },
      ],
    });
  }

  return new NextResponse(null, { status: 404 });
}