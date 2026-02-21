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