import HeroSection from "@/components/sections/HeroSection";
import TextSection from "@/components/sections/TextSection";
import ImageTextSection from "@/components/sections/ImageTextSection";
import VideoTextSection from "@/components/sections/VideoTextSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import StatsSection from "@/components/sections/StatsSection";
import LogosSection from "@/components/sections/LogosSection";
import FaqSection from "@/components/sections/FaqSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import DividerSection from "@/components/sections/DividerSection";
import SpacerSection from "@/components/sections/SpacerSection";
import CtaSection from "@/components/sections/CtaSection";
import CarouselLazy from "@/components/sections/CarouselLazy";

export const componentByType: Record<string, React.ComponentType<{ data: any }>> = {
  hero: HeroSection,
  text: TextSection,
  imageText: ImageTextSection,
  videoText: VideoTextSection,
  features: FeaturesSection,
  stats: StatsSection,
  logos: LogosSection,
  faq: FaqSection,
  testimonials: TestimonialsSection,
  pricing: PricingSection,
  divider: DividerSection,
  spacer: SpacerSection,
  cta: CtaSection,

  // pesado: client lazy
  carousel: CarouselLazy,
};