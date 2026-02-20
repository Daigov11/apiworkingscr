import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const pages: Record<string, any> = {
    home: {
      slug: "home",
      metaTitle: "ApiWorking | Sistemas para negocios",
      metaDescription: "Soluciones para restaurantes, hoteles y más.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        {
          id: "h1",
          type: "hero",
          data: {
            title: "ApiWorking",
            subtitle: "Sistemas modernos para negocios",
            ctaText: "Ver soluciones",
            ctaHref: "/sistema-de-restaurantes",
          },
        },
        {
          id: "h2",
          type: "text",
          data: {
            title: "¿Qué ofrecemos?",
            text: "Módulos flexibles para ventas, reportes y operaciones. Todo armado con secciones editables.",
          },
        },
        {
          id: "h3",
          type: "reviews",
          data: {
            title: "Opiniones",
            items: [
              { name: "Cliente 1", text: "Muy práctico y rápido." },
              { name: "Cliente 2", text: "Ahora todo está ordenado." },
            ],
          },
        },
      ],
    },

    "sistema-de-restaurantes": {
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
    },

    "sistema-para-hoteles": {
      slug: "sistema-para-hoteles",
      metaTitle: "Sistema para Hoteles | ApiWorking",
      metaDescription: "Reservas, reportes y control operativo en un solo sistema.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        {
          id: "ht1",
          type: "hero",
          data: {
            title: "Sistema para Hoteles",
            subtitle: "Reservas + Control + Reportes",
            ctaText: "Solicitar demo",
            ctaHref: "/contacto",
          },
        },
        {
          id: "ht2",
          type: "text",
          data: { title: "Beneficios", text: "Centraliza reservas, disponibilidad y reportes." },
        },
      ],
    },

    contacto: {
      slug: "contacto",
      metaTitle: "Contacto | ApiWorking",
      metaDescription: "Contáctanos para una demo o cotización.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        { id: "c1", type: "hero", data: { title: "Contacto", subtitle: "Hablemos de tu negocio" } },
        { id: "c2", type: "text", data: { text: "Aquí irá tu formulario / WhatsApp / datos de contacto." } },
      ],
    },

    demo: {
      slug: "demo",
      metaTitle: "Demo | ApiWorking",
      metaDescription: "Solicita una demo de ApiWorking.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        { id: "d1", type: "hero", data: { title: "Solicitar demo", subtitle: "Te mostramos el sistema en vivo" } },
        { id: "d2", type: "text", data: { text: "Aquí irá el flujo para pedir demo." } },
      ],
    },

    nosotros: {
      slug: "nosotros",
      metaTitle: "Nosotros | ApiWorking",
      metaDescription: "Conoce el equipo y visión de ApiWorking.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        { id: "n1", type: "hero", data: { title: "Nosotros", subtitle: "Construimos sistemas que ordenan negocios" } },
        { id: "n2", type: "text", data: { text: "Aquí irá la historia, misión y valores." } },
      ],
    },
  };

  if (pages[slug]) return NextResponse.json(pages[slug]);

  return new NextResponse(null, { status: 404 });
}