"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";

export default function FloatingCart() {
  const pathname = usePathname();
  const { cartCount, subtotal } = useStore();

  if (!cartCount || pathname === "/cart" || pathname === "/checkout") return null;

  return (
    <aside className="fixed bottom-[calc(132px+env(safe-area-inset-bottom))] right-3 z-40 sm:right-5 md:bottom-20">
      <Link
        href="/cart"
        aria-label={`View bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}, ${formatPrice(subtotal)}`}
        className="cart-float-in group inline-flex min-h-11 max-w-[calc(100vw-24px)] items-center gap-2.5 rounded-full border border-[#d9d2c4] bg-white/95 py-2 pl-3 pr-3.5 text-[#173d38] shadow-[0_4px_16px_rgba(23,61,56,0.14)] backdrop-blur transition hover:border-[#b99458] hover:shadow-[0_6px_20px_rgba(23,61,56,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b54] md:gap-3 md:pl-4 md:pr-4"
      >
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f3f0e8]">
          <ShoppingBag size={15} strokeWidth={1.7} />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#173d38] px-1 text-[8px] font-medium text-white">
            {cartCount}
          </span>
        </span>
        <span className="whitespace-nowrap text-[10px] font-medium sm:text-xs">
          Bag · {formatPrice(subtotal)}
        </span>
        <ArrowRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </aside>
  );
}
