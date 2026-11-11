"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { formatPrice, products } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";
import ProductCard from "@/components/store/ProductCard";

export default function ProductDetails({ product }) {
  const { addToCart, wishlist, toggleWishlist, catalog } = useStore();
  const hasInventory = Boolean(product.stock && Object.keys(product.stock).length);
  const availableSizes = product.sizes.filter((item) => Number(product.stock?.[item] ?? 0) > 0);
  const [size, setSize] = useState(availableSizes[0] ?? product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const isSaved = wishlist.includes(product.id);
  const relatedProducts = catalog.length ? catalog : products;
  const related = relatedProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  function handleAdd() {
    if (hasInventory && !availableSizes.includes(size)) return;
    addToCart(product.id, size, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="bg-[#F8F7F4]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 md:px-10 lg:px-12">
        <Link href="/shop" className="mb-7 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-500 hover:text-[#111820]">
          <ArrowLeft size={14} /> Back to shop
        </Link>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#EAE7E1]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute left-5 top-5 rounded-full bg-[#F8F7F4] px-4 py-2 text-[10px] uppercase tracking-[0.2em]">
                {product.badge}
              </span>
            )}
          </div>
          <div className="py-2 lg:py-10">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">{product.category}</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-[#111820] md:text-5xl">{product.name}</h1>
            <div className="mt-5 flex items-center gap-3">
              <p className="text-xl font-medium text-[#111820]">{formatPrice(product.price)}</p>
              {product.compareAtPrice && (
                <p className="text-base text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</p>
              )}
            </div>
            <p className="mt-6 max-w-xl text-sm leading-7 text-gray-600">{product.description}</p>
            <p className="mt-6 text-sm text-gray-700">Color: <span className="font-medium text-[#111820]">{product.color}</span></p>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600">Select size</p>
                <Link href="/contact" className="text-xs text-gray-500 underline underline-offset-4">Need help choosing?</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSize(item)}
                    aria-pressed={size === item}
                    disabled={hasInventory && !availableSizes.includes(item)}
                    className={`min-w-12 rounded-full border px-4 py-3 text-xs transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      size === item
                        ? "border-[#111820] bg-[#111820] text-white"
                        : "border-black/15 bg-white text-[#111820] hover:border-black/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {hasInventory && (
                <p className="mt-3 text-xs text-gray-500">
                  {availableSizes.length
                    ? `${product.stock[size] ?? 0} available in size ${size}`
                    : "Currently out of stock"}
                </p>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center rounded-full border border-black/10 bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="p-3 text-[#111820]"
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-8 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((current) => Math.min(10, current + 1))}
                  className="p-3 text-[#111820]"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={hasInventory && !availableSizes.includes(size)}
                className="inline-flex min-w-48 flex-1 items-center justify-center gap-2 rounded-full bg-[#111820] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#30363d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={15} /> {added ? "Added to your bag" : "Add to bag"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white"
              >
                <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={17} /> Free delivery on orders over ৳3,000
              </p>
              <p className="mt-3 text-xs leading-5 text-gray-500">Easy exchanges within 7 days. Payments are collected on delivery.</p>
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <section className="mt-20">
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Complete the look</p>
                <h2 className="mt-3 font-serif text-3xl text-[#111820]">You may also like</h2>
              </div>
              <Link href="/shop" className="text-xs uppercase tracking-[0.16em] underline underline-offset-4">Shop all</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
