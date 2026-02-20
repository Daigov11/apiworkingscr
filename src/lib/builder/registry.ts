import { z } from "zod";
import type { SectionDef, SectionInstance } from "./types";

import HeroSection from "@/components/sections/HeroSection";
import TextSection from "@/components/sections/TextSection";
import ImageTextSection from "@/components/sections/ImageTextSection";
import VideoTextSection from "@/components/sections/VideoTextSection";

// ✅ Define schemas por módulo (esto será oro para el admin)
const heroSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
});

const textSchema = z.object({
  title: z.string().optional(),
  text: z.string().min(1),
});

const imageTextSchema = z.object({
  title: z.string().optional(),
  text: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string().optional(),
  reverse: z.boolean().optional(),
});

const videoTextSchema = z.object({
  title: z.string().optional(),
  text: z.string().min(1),
  videoUrl: z.string().min(1),
  reverse: z.boolean().optional(),
});

export const sectionRegistry = {
  hero: {
    type: "hero",
    label: "Hero",
    schema: heroSchema,
    defaults: () => ({ title: "Título", subtitle: "Subtítulo", ctaText: "Solicitar demo", ctaHref: "/demo" }),
    fields: [
      { name: "title", label: "Título", kind: "text" },
      { name: "subtitle", label: "Subtítulo", kind: "textarea" },
      { name: "ctaText", label: "Texto botón", kind: "text" },
      { name: "ctaHref", label: "Link botón", kind: "url" },
    ],
    Component: HeroSection,
  } satisfies SectionDef<z.infer<typeof heroSchema>>,

  text: {
    type: "text",
    label: "Texto",
    schema: textSchema,
    defaults: () => ({ title: "Título", text: "Escribe aquí..." }),
    fields: [
      { name: "title", label: "Título", kind: "text" },
      { name: "text", label: "Contenido", kind: "textarea" },
    ],
    Component: TextSection,
  } satisfies SectionDef<z.infer<typeof textSchema>>,

  imageText: {
    type: "imageText",
    label: "Imagen + Texto",
    schema: imageTextSchema,
    defaults: () => ({ title: "Título", text: "Texto...", imageUrl: "https://picsum.photos/800/600", imageAlt: "Imagen", reverse: false }),
    fields: [
      { name: "title", label: "Título", kind: "text" },
      { name: "text", label: "Texto", kind: "textarea" },
      { name: "imageUrl", label: "URL imagen", kind: "image" },
      { name: "imageAlt", label: "Alt", kind: "text" },
      { name: "reverse", label: "Invertir columnas", kind: "switch" },
    ],
    Component: ImageTextSection,
  } satisfies SectionDef<z.infer<typeof imageTextSchema>>,

  videoText: {
    type: "videoText",
    label: "Video + Texto",
    schema: videoTextSchema,
    defaults: () => ({ title: "Título", text: "Texto...", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", reverse: false }),
    fields: [
      { name: "title", label: "Título", kind: "text" },
      { name: "text", label: "Texto", kind: "textarea" },
      { name: "videoUrl", label: "URL video embed", kind: "url" },
      { name: "reverse", label: "Invertir columnas", kind: "switch" },
    ],
    Component: VideoTextSection,
  } satisfies SectionDef<z.infer<typeof videoTextSchema>>,
};

export type RegistryKey = keyof typeof sectionRegistry;

export function getSectionDef(type: string) {
  return (sectionRegistry as Record<string, any>)[type] as SectionDef<any> | undefined;
}

export function validateSection(section: SectionInstance) {
  const def = getSectionDef(section.type);
  if (!def) return { ok: false as const, error: "UNKNOWN_TYPE" as const };

  const parsed = def.schema.safeParse(section.data);
  if (!parsed.success) return { ok: false as const, error: "INVALID_DATA" as const, issues: parsed.error.issues };

  return { ok: true as const, def, data: parsed.data };
}