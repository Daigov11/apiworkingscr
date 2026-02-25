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
  title: z.string().optional(),
  text: z.string().min(1),
  videoUrl: z.string().min(1),
  reverse: z.boolean().optional(),
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
};