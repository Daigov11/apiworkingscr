import { z } from "zod";

/* =========================
   Schemas (Zod)
   ========================= */

export const heroSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
});

export const textSchema = z.object({
  title: z.string().optional(),
  text: z.string().min(1),
});

export const imageTextSchema = z.object({
  title: z.string().optional(),
  text: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string().optional(),
  reverse: z.boolean().optional(),
});

export const videoTextSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  text: z.string().optional(),
  videoUrl: z.string().min(1),
  layout: z.enum(["split", "stacked"]).optional(),
  reverse: z.boolean().optional(),
  textAlign: z.enum(["left", "center"]).optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
});

export const featuresSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        text: z.string().min(1),
        icon: z.string().optional(),
      })
    )
    .min(1),
});

export const statsSchema = z.object({
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      })
    )
    .min(1),
});

export const logosSchema = z.object({
  title: z.string().optional(),
  logos: z
    .array(
      z.object({
        imageUrl: z.string().min(1),
        alt: z.string().optional(),
        href: z.string().optional(),
      })
    )
    .min(1),
});

export const faqSchema = z.object({
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .min(1),
});

export const testimonialsSchema = z.object({
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        role: z.string().optional(),
        text: z.string().min(1),
        avatarUrl: z.string().optional(),
      })
    )
    .min(1),
});

export const ctaSchema = z.object({
  title: z.string().min(1),
  text: z.string().optional(),
  ctaText: z.string().min(1),
  ctaHref: z.string().min(1),
});

export const dividerSchema = z.object({
  label: z.string().optional(),
});

export const spacerSchema = z.object({
  size: z.number().min(0).max(200),
});

export const pricingSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  plans: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.string().min(1),
        period: z.string().optional(),
        features: z.array(z.string()).default([]),
        ctaText: z.string().optional(),
        ctaHref: z.string().optional(),
        highlighted: z.boolean().optional(),
      })
    )
    .min(1),
});

export const carouselSchema = z.object({
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        imageUrl: z.string().min(1),
        alt: z.string().optional(),
        caption: z.string().optional(),
        href: z.string().optional(),
      })
    )
    .min(1),
});
export const ProductsGridSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  productSlugs: z.array(z.string()).min(1),
  showPrice: z.boolean().optional(),
  showAddToCart: z.boolean().optional(),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
});
export const heroMediaSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),

  badges: z.array(z.string()).optional(),

  primaryCta: z.object({
    text: z.string(),
    href: z.string(),
  }).optional(),

  secondaryCta: z.object({
    text: z.string(),
    href: z.string(),
  }).optional(),

  mediaType: z.enum(["image", "video"]).optional(),
  mediaUrl: z.string().optional(),
  mediaAlt: z.string().optional(),

  includesTitle: z.string().optional(),
  includesText: z.string().optional(),
  includesImages: z.array(
    z.object({
      imageUrl: z.string(),
      alt: z.string().optional(),
    })
  ).optional(),
});
export const cardsGridSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  cards: z.array(
    z.object({
      imageUrl: z.string(),
      imageAlt: z.string().optional(),
      title: z.string(),
      text: z.string().optional(),
      ctaText: z.string().optional(),
      ctaHref: z.string().optional(),
    })
  ).min(1),
});
export const pricingTabsSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),

  infoCta: z
    .object({
      text: z.string(),
      href: z.string(),
    })
    .optional(),

  currency: z.string().optional(),

  billingOptions: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        unit: z.string().optional(),
      })
    )
    .min(1),

  defaultBilling: z.string().optional(),

  plans: z
    .array(
      z.object({
        name: z.string(),
        badge: z.string().optional(),
        highlighted: z.boolean().optional(),
        features: z.array(z.string()).default([]),
        ctaText: z.string().optional(),
        ctaHref: z.string().optional(),
pricing: z.record(
  z.string(),
  z.object({
    normal: z.number(),
    promo: z.number().optional(),
  })
),
      })
    )
    .min(1),

  note: z.string().optional(),
});
export const contactFormSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  formTitle: z.string().optional(),
  giroOptions: z.array(z.string()).optional(),
  primaryCtaText: z.string().optional(),
  secondaryCtaText: z.string().optional(),
});

export const contactFormSplitSchema = contactFormSchema.extend({
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
});
export const ctaSplitSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  primaryCta: z.object({ text: z.string(), href: z.string() }).optional(),
  secondaryCta: z.object({ text: z.string(), href: z.string() }).optional(),
  slides: z.array(
    z.object({
      imageUrl: z.string(),
      alt: z.string().optional(),
      caption: z.string().optional(),
      href: z.string().optional(),
    })
  ).min(1),
});
/* =========================
   Public mapping (IMPORTANT)
   ========================= */

export const schemaByType: Record<string, z.ZodTypeAny> = {
  hero: heroSchema,
  text: textSchema,
  imageText: imageTextSchema,
  videoText: videoTextSchema,
  features: featuresSchema,
  stats: statsSchema,
  logos: logosSchema,
  faq: faqSchema,
  testimonials: testimonialsSchema,
  cta: ctaSchema,
  divider: dividerSchema,
  spacer: spacerSchema,
  pricing: pricingSchema,
  carousel: carouselSchema,
  heroMedia: heroMediaSchema,
  cardsGrid: cardsGridSchema,
ctaSplit: ctaSplitSchema,
pricingTabs: pricingTabsSchema,
contactForm: contactFormSchema,
contactFormSplit: contactFormSplitSchema,
  // ✅ agrega esto
  productsGrid: ProductsGridSchema,
};