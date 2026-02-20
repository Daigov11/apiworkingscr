import type { PageSection } from "@/libs/types/cms";
import HeroSection from "@/components/sections/HeroSection";
import TextSection from "@/components/sections/TextSection";
import ImageTextSection from "@/components/sections/ImageTextSection";
import ReviewsSection from "@/components/sections/ReviewsSection";

export default function SectionRenderer({ section }: { section: PageSection }) {
  switch (section.type) {
    case "hero":
      return <HeroSection data={section.data} />;
    case "text":
      return <TextSection data={section.data} />;
    case "imageText":
      return <ImageTextSection data={section.data} />;
    case "reviews":
      return <ReviewsSection data={section.data} />;
    default:
      return null;
  }
}