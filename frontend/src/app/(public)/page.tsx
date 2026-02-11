import {
  HeroSection,
  FeaturesOverview,
  HowItWorks,
  PricingPreview,
  CTASection,
} from "@/components/landing";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesOverview />
      <HowItWorks />
      <PricingPreview />
      <CTASection />
    </>
  );
}
