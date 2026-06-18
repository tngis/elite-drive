import { Hero } from "@/features/home/components/hero";
import { CategoryStrip } from "@/features/home/components/category-strip";
import { FeaturedCars } from "@/features/home/components/featured-cars";
import { HowItWorks } from "@/features/home/components/how-it-works";
import { OwnerCta } from "@/features/home/components/owner-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <CategoryStrip /> */}
      <FeaturedCars />
      <HowItWorks />
      <OwnerCta />
    </>
  );
}
