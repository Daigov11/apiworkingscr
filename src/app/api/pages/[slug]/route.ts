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
      metaDescription: "Soluciones editables por módulos: texto, video, carrusel, pricing, FAQ y más.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        { id: "h1", type: "hero", data: { title: "ApiWorking", subtitle: "XD", ctaText: "Ver restaurantes", ctaHref: "/sistema-de-restaurantes" } },

        { id: "h2", type: "features", data: { title: "Beneficios", subtitle: "Módulos editables sin tocar código", items: [
          { title: "Rápido", text: "SSR + módulos ligeros.", icon: "⚡" },
          { title: "Editable", text: "El cliente reordena secciones.", icon: "🧩" },
          { title: "SEO", text: "Meta + sitemap + SSR.", icon: "🔎" },
        ]}},

        { id: "h3", type: "stats", data: { title: "Resultados", items: [
          { value: "99.9%", label: "estabilidad" },
          { value: "15+", label: "módulos" },
          { value: "24/7", label: "operación" },
          { value: "1 min", label: "cambios visibles" },
        ]}},

        { id: "h4", type: "logos", data: { title: "Partners / Marcas", logos: [
          { imageUrl: "https://dummyimage.com/160x50/111/fff&text=Logo+1", alt: "Logo 1" },
          { imageUrl: "https://dummyimage.com/160x50/111/fff&text=Logo+2", alt: "Logo 2" },
          { imageUrl: "https://dummyimage.com/160x50/111/fff&text=Logo+3", alt: "Logo 3" },
        ]}},

        { id: "h5", type: "imageText", data: { title: "Control total", text: "Ordena secciones como quieras (video primero, carrusel después, etc.).", imageUrl: "https://picsum.photos/900/650", imageAlt: "Dashboard", reverse: false } },

        { id: "h6", type: "videoText", data: { title: "Demo rápida", text: "Video + texto configurable.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", reverse: true } },

        { id: "h7", type: "faq", data: { title: "Preguntas frecuentes", items: [
          { question: "¿Puedo reordenar secciones?", answer: "Sí. El admin podrá mover módulos arriba/abajo." },
          { question: "¿Puedo agregar bloques nuevos?", answer: "Sí, mientras existan en el catálogo de módulos." },
        ]}},

        { id: "h8", type: "testimonials", data: { title: "Opiniones", items: [
          { name: "Cliente 1", role: "Restaurante", text: "Muy práctico y rápido." },
          { name: "Cliente 2", role: "Hotel", text: "Ahora todo está ordenado." },
          { name: "Cliente 3", role: "Minimarket", text: "Súper fácil de administrar." },
        ]}},

        { id: "h9", type: "divider", data: { label: "Separador" } },
        { id: "h10", type: "spacer", data: { size: 24 } },

        { id: "h11", type: "pricing", data: { title: "Planes", subtitle: "Un ejemplo básico (editable)", plans: [
          { name: "Starter", price: "S/ 99", period: "mes", features: ["Landing", "Secciones básicas"], ctaText: "Elegir", ctaHref: "/contacto" },
          { name: "Pro", price: "S/ 199", period: "mes", highlighted: true, features: ["Page Builder", "SEO completo", "Soporte"], ctaText: "Elegir", ctaHref: "/contacto" },
          { name: "Enterprise", price: "Cotizar", features: ["A medida", "Integraciones"], ctaText: "Hablar", ctaHref: "/contacto" },
        ]}},

        { id: "h12", type: "carousel", data: { title: "Capturas", items: [
          { imageUrl: "https://picsum.photos/1200/600?1", caption: "Pantalla 1" },
          { imageUrl: "https://picsum.photos/1200/600?2", caption: "Pantalla 2" },
          { imageUrl: "https://picsum.photos/1200/600?3", caption: "Pantalla 3" },
        ]}},

        { id: "h13", type: "cta", data: { title: "¿Listo para implementarlo?", text: "Pide una demo y lo adaptamos a tu negocio.", ctaText: "Solicitar demo", ctaHref: "/demo" } },
      ],
    },

    "sistema-de-restaurantes": {
      slug: "sistema-de-restaurantes",
      metaTitle: "Sistema de Restaurantes | ApiWorking",
      metaDescription: "Controla ventas, mesas, comandas y pagos con ApiWorking.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        { id: "s1", type: "hero", data: { title: "Sistema de Restaurantes", subtitle: "Ventas + Mesas + Comandas + Pagos", ctaText: "Solicitar demo", ctaHref: "/contacto" } },
        { id: "s2", type: "features", data: { title: "Incluye", items: [
          { title: "Comandas", text: "Control en tiempo real.", icon: "🧾" },
          { title: "Mesas", text: "Estado de ocupación.", icon: "🍽️" },
          { title: "Reportes", text: "Ventas y caja.", icon: "📊" },
        ]}},
        { id: "s3", type: "testimonials", data: { title: "Opiniones", items: [
          { name: "Carlos", role: "Pollería", text: "Me ordenó el negocio." },
        ]}},
        { id: "s4", type: "cta", data: { title: "¿Quieres verlo funcionando?", text: "Te damos una demo rápida.", ctaText: "Ir a contacto", ctaHref: "/contacto" } },
      ],
    },

    "sistema-para-hoteles": {
      slug: "sistema-para-hoteles",
      metaTitle: "Sistema para Hoteles | ApiWorking",
      metaDescription: "Reservas, reportes y control operativo en un solo sistema.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        { id: "ht1", type: "hero", data: { title: "Sistema para Hoteles", subtitle: "Reservas + Control + Reportes", ctaText: "Solicitar demo", ctaHref: "/contacto" } },
        { id: "ht2", type: "text", data: { title: "Beneficios", text: "Centraliza reservas, disponibilidad y reportes." } },
        { id: "ht3", type: "cta", data: { title: "¿Hablamos?", text: "Cuéntanos tu caso.", ctaText: "Contactar", ctaHref: "/contacto" } },
      ],
    },

    contacto: {
      slug: "contacto",
      metaTitle: "Contacto | ApiWorking",
      metaDescription: "Contáctanos para una demo o cotización.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        { id: "c1", type: "hero", data: { title: "Contacto", subtitle: "Hablemos de tu negocio" } },
        { id: "c2", type: "text", data: { title: "Canales", text: "Aquí irá tu formulario / WhatsApp / datos de contacto." } },
      ],
    },

    demo: {
      slug: "demo",
      metaTitle: "Demo | ApiWorking",
      metaDescription: "Solicita una demo de ApiWorking.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        { id: "d1", type: "hero", data: { title: "Solicitar demo", subtitle: "Te mostramos el sistema en vivo" } },
        { id: "d2", type: "text", data: { title: "Demo", text: "Aquí irá el flujo para pedir demo." } },
      ],
    },

    nosotros: {
      slug: "nosotros",
      metaTitle: "Nosotros | ApiWorking",
      metaDescription: "Conoce el equipo y visión de ApiWorking.",
      ogImage: "https://picsum.photos/1200/630",
      sections: [
        { id: "n1", type: "hero", data: { title: "Nosotros", subtitle: "Construimos sistemas que ordenan negocios" } },
        { id: "n2", type: "text", data: { title: "Historia", text: "Aquí irá la historia, misión y valores." } },
      ],
    },
  };

  if (pages[slug]) return NextResponse.json(pages[slug]);

  return new NextResponse(null, { status: 404 });
}