"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Zap } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist, catalog, catalogLoaded } = useStore();
  const liveProduct = catalog.find((item) => item.id === product.id);
  const item = liveProduct ?? product;
  const [chosenSize, setChosenSize] = useState("");
  if (catalogLoaded && !liveProduct) return null;

  const isSaved = wishlist.includes(item.id);
  const hasInventory = Boolean(item.stock && Object.keys(item.stock).length);
  const availableSizes = hasInventory
    ? item.sizes.filter((size) => Number(item.stock?.[size] ?? 0) > 0)
    : item.sizes;
  const selectedSize = availableSizes.includes(chosenSize)
    ? chosenSize
    : availableSizes[0] ?? "";
  const totalStock = item.sizes.reduce(
    (total, size) => total + Number(item.stock?.[size] ?? 0),
    0,
  );
  const soldOut = hasInventory && availableSizes.length === 0;

  function orderNow() {
    if (!selectedSize || soldOut) return;
    addToCart(item.id, selectedSize);
    router.push("/checkout");
  }

  return (
    <article className="group min-w-0 overflow-hidden rounded-[18px] border border-[#e7e0d4] bg-white shadow-[0_8px_24px_rgba(23,61,56,0.05)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f2f1ec]">
        <Link href={`/shop/${item.slug}`} aria-label={`View ${item.name}`} className="absolute inset-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </Link>
        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.18em] text-[#173d38] backdrop-blur-sm">
            {item.badge}
          </span>
        )}
        {item.compareAtPrice > item.price && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#173d38]/90 px-2.5 py-1 text-[9px] font-medium text-white">
            Save {Math.round((1 - item.price / item.compareAtPrice) * 100)}%
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(item.id)}
          aria-label={isSaved ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#173d38] shadow-[0_4px_12px_rgba(23,61,56,0.08)] transition hover:bg-[#f3ed5b]"
        >
          <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#9a7944]">
          {item.category}
        </p>
        <Link
          href={`/shop/${item.slug}`}
          className="block truncate text-sm font-semibold text-[#173d38] transition hover:text-[#075b54] sm:text-base"
        >
          {item.name}
        </Link>
        <p className="mt-1 truncate text-[11px] text-[#6d675f]">{item.color}</p>

        {item.sizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Choose a size">
            {item.sizes.map((size) => {
              const unavailable = hasInventory && !availableSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setChosenSize(size)}
                  disabled={unavailable}
                  aria-pressed={selectedSize === size}
                  aria-label={unavailable ? `Size ${size}, out of stock` : `Choose size ${size}`}
                  className={`min-w-8 rounded-md border px-2 py-1.5 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-35 ${
                    selectedSize === size
                      ? "border-[#b99458] bg-[#f8f3e8] text-[#173d38]"
                      : "border-[#e7e0d4] bg-white text-[#52665f] hover:border-[#b99458]"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-1 border-t border-[#eee8dc] pt-3">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <span className="text-base font-semibold leading-tight text-[#173d38] sm:text-lg">
              {formatPrice(item.price)}
            </span>
            {item.compareAtPrice > item.price && (
              <span className="text-[11px] text-[#92958e] line-through sm:text-xs">
                {formatPrice(item.compareAtPrice)}
              </span>
            )}
          </div>
          <span className={`shrink-0 text-[10px] font-medium ${soldOut ? "text-[#a34c3b]" : "text-[#8b6b37]"}`}>
            {hasInventory ? (soldOut ? "Out of stock" : `Stock: ${totalStock}`) : "In stock"}
          </span>
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={orderNow}
            disabled={soldOut || !selectedSize}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[#075b54] px-3 font-albert-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#173d38] disabled:cursor-not-allowed disabled:bg-[#92958e]"
          >
            {soldOut ? (
              "Sold out"
            ) : (
              <>
                <Zap size={14} aria-hidden="true" />
                Order Now
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
