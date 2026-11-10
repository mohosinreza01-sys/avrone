"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, ShoppingBag } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";

const links = [
  { label: "Home", href: "/", icon: House },
  { label: "Shop", href: "/shop", icon: LayoutGrid },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
];

export default function MobileShopNav() {
  const pathname = usePathname();
  const { cartCount } = useStore();

  return (
    <nav
      aria-label="Mobile storefront navigation"
      className="fixed inset-x-0 bottom-0 z-[55] grid h-[68px] grid-cols-3 border-t border-[#075b54]/10 bg-white/95 text-[#124d48] shadow-[0_-8px_24px_rgba(7,91,84,0.07)] backdrop-blur-md md:hidden"
    >
      {links.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        const count = href === "/cart" ? cartCount : 0;

        return (
          <Link
            key={href}
            href={href}
            aria-label={count ? `${label}, ${count} items` : label}
            aria-current={active ? "page" : undefined}
            className={`relative flex flex-col items-center justify-center gap-1 text-[9px] uppercase tracking-[0.12em] ${
              active ? "text-[#075b54]" : "text-[#68807a]"
            }`}
          >
            <span className="relative">
              <Icon size={20} strokeWidth={1.7} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f3ed5b] px-1 text-[9px] font-medium text-[#075b54]">
                  {count}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
