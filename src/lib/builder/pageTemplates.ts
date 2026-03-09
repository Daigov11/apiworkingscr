export type CmsTemplateSection = {
  sectionKey: string;
  type: string;
  sortOrder: number;
  dataJson: string;
};

export type PageTemplateKey = "none" | "home" | "restaurantes" | "hoteles";

export const PAGE_TEMPLATE_OPTIONS: Array<{
  value: PageTemplateKey;
  label: string;
}> = [
  { value: "none", label: "Sin plantilla (vacía)" },
  { value: "home", label: "Home (Landing)" },
  { value: "restaurantes", label: "Restaurantes" },
  { value: "hoteles", label: "Hoteles" },
];

const PAGE_TEMPLATE_MAP: Record<PageTemplateKey, CmsTemplateSection[]> = {
  none: [],

  home: [
    {
      sectionKey: "h1",
      type: "hero",
      sortOrder: 1,
      dataJson: JSON.stringify({
        title: "ApiWorking",
        subtitle: "Sistemas modernos para negocios. Todo editable por módulos.",
        ctaText: "Solicitar demo",
        ctaHref: "/contacto",
      }),
    },
    {
      sectionKey: "h2",
      type: "features",
      sortOrder: 2,
      dataJson: JSON.stringify({
        title: "¿Por qué ApiWorking?",
        subtitle: "Tu web se edita sin tocar código",
        items: [
          { title: "SEO real (SSR)", text: "Google indexa tus páginas por slug.", icon: "🔎" },
          { title: "Page Builder", text: "Agrega, quita y reordena módulos.", icon: "🧩" },
          { title: "Rápido", text: "Cargamos lo pesado cuando toca.", icon: "⚡" },
        ],
      }),
    },
    {
      sectionKey: "h3",
      type: "stats",
      sortOrder: 3,
      dataJson: JSON.stringify({
        title: "Resultados",
        items: [
          { value: "1 min", label: "para editar y publicar" },
          { value: "10+", label: "módulos listos" },
          { value: "SSR", label: "para SEO" },
          { value: "Lazy", label: "para performance" },
        ],
      }),
    },
    {
      sectionKey: "h4",
      type: "logos",
      sortOrder: 4,
      dataJson: JSON.stringify({
        title: "Clientes / Partners",
        logos: [
          { imageUrl: "https://dummyimage.com/160x50/111/fff&text=Logo+1", alt: "Logo 1" },
          { imageUrl: "https://dummyimage.com/160x50/111/fff&text=Logo+2", alt: "Logo 2" },
          { imageUrl: "https://dummyimage.com/160x50/111/fff&text=Logo+3", alt: "Logo 3" },
        ],
      }),
    },
    {
      sectionKey: "h5",
      type: "testimonials",
      sortOrder: 5,
      dataJson: JSON.stringify({
        title: "Opiniones",
        items: [
          { name: "Carlos", role: "Restaurante", text: "Me ordenó el negocio." },
          { name: "María", role: "Hotel", text: "Ahora todo está centralizado." },
        ],
      }),
    },
    {
      sectionKey: "h6",
      type: "pricing",
      sortOrder: 6,
      dataJson: JSON.stringify({
        title: "Planes",
        subtitle: "Ejemplo editable desde el CMS",
        plans: [
          {
            name: "Starter",
            price: "S/ 99",
            period: "mes",
            features: ["Landing básica", "Secciones esenciales"],
            ctaText: "Cotizar",
            ctaHref: "/contacto",
          },
          {
            name: "Pro",
            price: "S/ 199",
            period: "mes",
            highlighted: true,
            features: ["Page Builder", "SSR/SEO", "Soporte"],
            ctaText: "Solicitar demo",
            ctaHref: "/contacto",
          },
        ],
      }),
    },
    {
      sectionKey: "h7",
      type: "cta",
      sortOrder: 7,
      dataJson: JSON.stringify({
        title: "¿Listo para implementarlo?",
        text: "Te mostramos una demo y lo adaptamos a tu negocio.",
        ctaText: "Solicitar demo",
        ctaHref: "/contacto",
      }),
    },
  ],

  restaurantes: [
    {
      sectionKey: "r1",
      type: "hero",
      sortOrder: 1,
      dataJson: JSON.stringify({
        title: "Sistema de Restaurantes",
        subtitle: "Ventas + Mesas + Comandas + Caja",
        ctaText: "Solicitar demo",
        ctaHref: "/contacto",
      }),
    },
    {
      sectionKey: "r2",
      type: "features",
      sortOrder: 2,
      dataJson: JSON.stringify({
        title: "Beneficios",
        items: [
          { title: "Mesas y comandas", text: "Control total del salón.", icon: "🍽️" },
          { title: "Caja y reportes", text: "Cierre y métricas.", icon: "📊" },
          { title: "Rápido", text: "Flujo ágil para mozos.", icon: "⚡" },
        ],
      }),
    },
    {
      sectionKey: "r3",
      type: "faq",
      sortOrder: 3,
      dataJson: JSON.stringify({
        title: "Preguntas frecuentes",
        items: [
          { question: "¿Funciona en tablet?", answer: "Sí, es responsive." },
          { question: "¿Puedo editar la web?", answer: "Sí, por módulos desde el CMS." },
        ],
      }),
    },
    {
      sectionKey: "r4",
      type: "cta",
      sortOrder: 4,
      dataJson: JSON.stringify({
        title: "¿Te interesa para tu restaurante?",
        text: "Agenda una demo.",
        ctaText: "Solicitar demo",
        ctaHref: "/contacto",
      }),
    },
  ],

  hoteles: [
    {
      sectionKey: "h1",
      type: "hero",
      sortOrder: 1,
      dataJson: JSON.stringify({
        title: "Sistema para Hoteles",
        subtitle: "Reservas + Operación + Reportes",
        ctaText: "Solicitar demo",
        ctaHref: "/contacto",
      }),
    },
    {
      sectionKey: "h2",
      type: "features",
      sortOrder: 2,
      dataJson: JSON.stringify({
        title: "Beneficios",
        items: [
          { title: "Control", text: "Operación centralizada.", icon: "🏨" },
          { title: "Reportes", text: "Datos para decisiones.", icon: "📈" },
          { title: "Editable", text: "Landing por módulos.", icon: "🧩" },
        ],
      }),
    },
    {
      sectionKey: "h3",
      type: "cta",
      sortOrder: 3,
      dataJson: JSON.stringify({
        title: "¿Listo para una demo?",
        text: "Te mostramos el sistema.",
        ctaText: "Solicitar demo",
        ctaHref: "/contacto",
      }),
    },
  ],
};

export function getTemplateSections(key: PageTemplateKey): CmsTemplateSection[] {
  const sections = PAGE_TEMPLATE_MAP[key] ?? [];

  return sections.map((section, index) => ({
    ...section,
    sortOrder: index + 1,
  }));
}