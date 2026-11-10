"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";

const FREE_SHIPPING_THRESHOLD = 3000;
const SHIPPING_FEE = 150;

export default function CartContent() {
  const { cartItems, subtotal, setQuantity, removeFromCart } = useStore();
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  if (!cartItems.length) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Your bag</p>
        <h1 className="mt-4 font-serif text-4xl text-[#111820]">A little room for something good.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-600">Your bag is currently empty. Explore Panjabi and everyday styles made for life in Bangladesh.</p>
        <Link href="/shop" className="mt-8 inline-flex rounded-full bg-[#111820] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 lg:px-12">
      <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Your bag</p>
      <h1 className="mt-3 font-serif text-4xl text-[#111820] md:text-5xl">Shopping bag <span className="font-sans text-base text-gray-500">({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span></h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_0.7fr]">
        <div className="divide-y divide-black/10 border-y border-black/10">
          {cartItems.map(({ product, size, quantity }) => (
            <article key={`${product.id}-${size}`} className="grid grid-cols-[96px_1fr] gap-4 py-5 sm:grid-cols-[128px_1fr_auto] sm:gap-6">
              <Link href={`/shop/${product.slug}`} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#EAE7E1]">
                <Image src={product.image} alt={product.name} fill sizes="128px" className="object-cover" />
              </Link>
              <div className="flex flex-col justify-between">
                <div>
                  <Link href={`/shop/${product.slug}`} className="font-medium text-[#111820] hover:underline">{product.name}</Link>
                  <p className="mt-1 text-sm text-gray-500">{product.color} · Size {size}</p>
                  <p className="mt-2 text-sm font-medium text-[#111820]">{formatPrice(product.price)}</p>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="inline-flex items-center rounded-full border border-black/10 bg-white">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(product.id, size, quantity - 1)} className="p-2.5"><Minus size={13} /></button>
                    <span className="min-w-7 text-center text-xs">{quantity}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(product.id, size, quantity + 1)} className="p-2.5"><Plus size={13} /></button>
                  </div>
                  <button type="button" onClick={() => removeFromCart(product.id, size)} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#111820]">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
              <p className="col-span-2 text-right text-sm font-medium sm:col-span-1">{formatPrice(product.price * quantity)}</p>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-[1.7rem] bg-white p-6 shadow-[0_8px_30px_rgba(17,24,32,0.05)]">
          <h2 className="font-serif text-2xl text-[#111820]">Order summary</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span>{shipping ? formatPrice(shipping) : "Free"}</span></div>
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="rounded-xl bg-[#F8F7F4] p-3 text-xs leading-5 text-gray-600">Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free delivery.</p>
            )}
            <div className="flex justify-between border-t border-black/10 pt-4 text-base font-medium"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
          </div>
          <Link href="/checkout" className="mt-6 inline-flex w-full justify-center rounded-full bg-[#111820] px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-white hover:bg-[#30363d]">Continue to checkout</Link>
          <Link href="/shop" className="mt-4 inline-flex w-full justify-center text-xs text-gray-500 underline underline-offset-4">Continue shopping</Link>
          <p className="mt-6 text-center text-[10px] leading-5 text-gray-500">Secure checkout · Cash on delivery available</p>
        </aside>
      </div>
    </div>
  );
}
