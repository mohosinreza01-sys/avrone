"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";

export default function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [added, setAdded] = useState(false);
  const isSaved = wishlist.includes(product.id);

  function quickAdd() {
    addToCart(product.id, product.sizes[0]);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#f2f1ec]">
        <Link href={`/shop/${product.slug}`} aria-label={`View ${product.name}`} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 bg-white px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-[#075b54]">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#075b54] transition hover:bg-[#f3ed5b]"
        >
          <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={quickAdd}
          className="absolute bottom-3 left-3 right-3 flex translate-y-0 items-center justify-center gap-2 rounded-full bg-[#173d38] px-4 py-3 text-[9px] uppercase tracking-[0.18em] text-white opacity-100 transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
        >
          <ShoppingBag size={14} />
          {added ? "Added to bag" : "Buy now"}
        </button>
      </div>
      <div className="flex items-start justify-between gap-3 px-1 pt-4">
        <div className="min-w-0">
          <p className="mb-1.5 text-[8px] uppercase tracking-[0.23em] text-gray-500">{product.category}</p>
          <Link href={`/shop/${product.slug}`} className="block truncate text-[13px] font-medium tracking-[0.01em] text-[#124d48] hover:underline md:text-sm">
            {product.name}
          </Link>
          <p className="mt-1.5 text-[10px] text-gray-500 md:text-xs">{product.color}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[13px] font-medium text-[#124d48] md:text-sm">{formatPrice(product.price)}</p>
          {product.compareAtPrice && (
            <p className="text-xs text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</p>
          )}
        </div>
      </div>
    </article>
  );
}
