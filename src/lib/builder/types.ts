import { z } from "zod";

export type SectionInstance = {
  id: string;
  type: string;
  data: unknown;
};

export type PagePayload = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  sections: SectionInstance[];
};

export type FieldDef =
  | { name: string; label: string; kind: "text"; placeholder?: string }
  | { name: string; label: string; kind: "textarea"; placeholder?: string }
  | { name: string; label: string; kind: "image"; help?: string }
  | { name: string; label: string; kind: "url"; placeholder?: string }
  | { name: string; label: string; kind: "number"; min?: number; max?: number }
  | { name: string; label: string; kind: "switch" };

export type SectionDef<TData> = {
  type: string;
  label: string;
  isHeavy?: boolean; // para lazy load luego
  schema: z.ZodType<TData>;
  defaults: () => TData;
  fields: FieldDef[]; // (para el admin futuro)
  Component: React.ComponentType<{ data: TData }>;
};