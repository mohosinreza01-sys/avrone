"use client";

import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import { products } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";

export default function WishlistContent() {
  const { wishlist, catalog, catalogLoaded } = useStore();
  const savedProducts = (catalogLoaded ? catalog : products)
    .filter((product) => wishlist.includes(product.id) && product.active !== false);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 lg:px-12">
      <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Saved for later</p>
      <h1 className="mt-3 font-serif text-4xl text-[#111820] md:text-5xl">Your wishlist</h1>
      {savedProducts.length ? (
        <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {savedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-9 rounded-[1.5rem] border border-black/5 bg-white px-6 py-16 text-center">
          <p className="font-serif text-2xl text-[#111820]">Your wishlist is waiting for its first favorite.</p>
          <p className="mt-2 text-sm text-gray-500">Save pieces you love and find them here anytime.</p>
          <Link href="/shop" className="mt-7 inline-flex rounded-full bg-[#111820] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white">Explore the collection</Link>
        </div>
      )}
    </div>
  );
}
