import { Hero } from "@/components/home/hero";
import { CategoryStrip } from "@/components/home/category-strip";
import { FeaturedGear } from "@/components/home/featured-gear";
import { HowItWorks } from "@/components/home/how-it-works";
import { ProviderCta } from "@/components/home/provider-cta";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <CategoryStrip />
      <FeaturedGear />
      <HowItWorks />
      <ProviderCta />
    </div>
  );
}
