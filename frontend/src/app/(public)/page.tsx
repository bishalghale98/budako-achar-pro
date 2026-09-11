import {
  HeroSection,
  TrustSection,
  FeaturedProducts,
  BrandStory,
  WhyChooseUs,
  Testimonials,
  CTASection,
} from "@/components/home";
import { getProducts } from "@/lib/server/product";

export default async function Home() {
  const productsData = await getProducts({ featured: true });
  const featuredProducts = productsData.data ?? [];

  return (
    <>
      <HeroSection />
      <TrustSection />
      <FeaturedProducts products={featuredProducts} />
      <BrandStory />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </>
  );
}
