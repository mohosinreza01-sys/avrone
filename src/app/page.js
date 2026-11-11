import HomeHeroCarousel from "@/components/home/HomeHeroCarousel";
import HomepageProductSection from "@/components/home/HomepageProductSection";
import { products } from "@/data/products";

export default function HomePage() {
  const offer = products.find((product) => product.compareAtPrice);
  const discount = offer
    ? Math.round((1 - offer.price / offer.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-white">
      <HomeHeroCarousel offerPercent={discount} />

      <HomepageProductSection
        eyebrow="Fresh from the studio"
        title="New Arrivals"
        description="Meet the latest pieces, designed for the everyday and made to wear on repeat."
        products={products.slice(4, 8)}
        href="/shop"
        linkText="Shop all new"
      />

    </div>
  );
}
