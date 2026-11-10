import { Suspense } from "react";
import ShopSearchResults from "@/components/store/ShopSearchResults";
import { products } from "@/data/products";

export const metadata = {
  title: "Shop | AVRONE",
  description: "Explore AVRONE men's fashion and accessories, thoughtfully selected for everyday life in Bangladesh.",
};

export default function ShopPage() {
  return (
    <div className="min-h-[65vh] bg-[#F8F7F4]">
      <h1 className="sr-only">Shop AVRONE</h1>
      <section className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-10 lg:px-12">
        <Suspense fallback={<div className="min-h-64" aria-label="Loading products" />}>
          <ShopSearchResults products={products} />
        </Suspense>
      </section>
    </div>
  );
}
