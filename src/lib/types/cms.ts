export type PageSection =
  | {
      id: string;
      type: "hero";
      data: { title: string; subtitle?: string; ctaText?: string; ctaHref?: string };
    }
  | {
      id: string;
      type: "text";
      data: { title?: string; text: string };
    }
  | {
      id: string;
      type: "imageText";
      data: { title?: string; text: string; imageUrl: string; imageAlt?: string };
    }
  | {
      id: string;
      type: "reviews";
      data: { title?: string; items: Array<{ name: string; text: string }> };
    };

export type PagePayload = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  sections: PageSection[];
};