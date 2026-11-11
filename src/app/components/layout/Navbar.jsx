"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Grid2X2,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { categories } from "@/data/categories";
import { collectionSlugs } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";

const featuredNavigation = [
  { name: "New Arrivals", href: "/shop?filter=new-arrivals" },
  { name: "Best Sellers", href: "/shop?filter=best-sellers" },
  { name: "Winter Collection", href: "/collections/winter-collection" },
  { name: "Sale", href: "/shop?filter=sale", sale: true },
];

const otherPages = [
  { name: "Our story", href: "/about" },
  { name: "Journal", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const menSubcategories = ["Panjabi", "Shirts", "Bottomwear"];

function getCategoryHref(category, subcategory) {
  if (!subcategory) return `/collections/${category.slug}`;
  const slug = collectionSlugs[subcategory];
  return slug ? `/collections/${slug}` : `/collections/${category.slug}`;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const headerRef = useRef(null);
  const { cartCount, wishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) {
        setCategoryMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setCategoryMenuOpen(false);
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    router.push(`/shop${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  function closeMenus() {
    setCategoryMenuOpen(false);
    setMenuOpen(false);
    setMobileCategoryOpen(null);
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-[#e7e0d4] bg-white text-[#173d38] shadow-[0_3px_14px_rgba(23,61,56,0.04)]"
    >
      <div className="mx-auto flex h-[68px] max-w-[1480px] items-center justify-between gap-3 px-4 sm:px-5 lg:h-[78px] lg:px-8">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-[#f5f2eb] lg:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <Link href="/" onClick={closeMenus} className="flex shrink-0 flex-col items-center lg:relative lg:h-full lg:w-[126px] lg:translate-x-4 lg:justify-center">
          <Image
            src="/images/avrone-logo.png"
            alt="AVRONE"
            width={681}
            height={277}
            priority
            className="h-[40px] w-[98px] object-contain sm:h-[43px] sm:w-[106px] lg:absolute lg:left-0 lg:top-1/2 lg:h-[46px] lg:w-[113px] lg:-translate-y-1/2"
          />
          <span className="text-[7px] tracking-[0.55em] text-[#657d78] sm:text-[8px] lg:absolute lg:bottom-0 lg:left-0 lg:w-full lg:text-center">LIFESTYLE</span>
        </Link>

        <form onSubmit={submitSearch} className="mx-auto hidden w-full max-w-[520px] lg:flex">
          <label htmlFor="desktop-store-search" className="sr-only">Search products</label>
          <div className="flex h-11 w-full items-center rounded-full border border-[#e5e0d7] bg-[#f8f7f3] pl-4 pr-1 transition focus-within:border-[#a98a52]">
            <Search size={17} className="shrink-0 text-[#73827b]" />
            <input
              id="desktop-store-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for products..."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#8d9690]"
            />
            <button type="submit" className="flex h-9 items-center gap-2 rounded-full bg-[#173d38] px-4 text-[10px] font-medium uppercase tracking-[0.1em] text-white transition hover:bg-[#245b53]">
              Search
            </button>
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5 lg:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label={searchOpen ? "Close search" : "Open search"}
            className="flex h-10 w-9 items-center justify-center rounded-full transition hover:bg-[#f5f2eb] lg:hidden"
          >
            {searchOpen ? <X size={19} strokeWidth={1.6} /> : <Search size={19} strokeWidth={1.6} />}
          </button>
          <Link href="/account/login" aria-label="Account" className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f5f2eb] sm:flex">
            <UserRound size={19} strokeWidth={1.5} />
          </Link>
          <Link href="/wishlist" aria-label={`Wishlist, ${wishlist.length} saved`} className="relative flex h-10 w-9 items-center justify-center rounded-full transition hover:bg-[#f5f2eb] sm:w-10">
            <Heart size={19} strokeWidth={1.5} />
            {wishlist.length > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#a98a52] px-1 text-[9px] text-white">{wishlist.length}</span>}
          </Link>
          <Link href="/cart" aria-label={`Shopping bag, ${cartCount} items`} className="relative flex h-10 w-9 items-center justify-center rounded-full transition hover:bg-[#f5f2eb] sm:w-10">
            <ShoppingBag size={19} strokeWidth={1.5} />
            {cartCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#173d38] px-1 text-[9px] text-white">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="border-t border-[#e7e0d4] bg-white px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-xl gap-2">
            <label htmlFor="mobile-store-search" className="sr-only">Search products</label>
            <input
              id="mobile-store-search"
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 rounded-full border border-[#e5e0d7] bg-[#f8f7f3] px-4 py-3 text-sm outline-none focus:border-[#a98a52]"
            />
            <button type="submit" className="rounded-full bg-[#173d38] px-5 text-[9px] uppercase tracking-[0.15em] text-white">Search</button>
          </div>
        </form>
      )}

      <nav aria-label="Main navigation" className="hidden border-t border-[#e9e4da] lg:block">
        <div className="mx-auto flex h-[50px] max-w-[1480px] items-center gap-7 px-8">
          <div className="relative h-full">
            <button
              type="button"
              onClick={() => setCategoryMenuOpen((open) => !open)}
              aria-expanded={categoryMenuOpen}
              aria-controls="desktop-category-menu"
              className={`flex h-full items-center gap-2.5 border-b-2 px-4 text-[11px] font-medium uppercase tracking-[0.1em] transition ${categoryMenuOpen ? "border-[#b99458] bg-[#f7f4ed] text-[#173d38]" : "border-transparent text-[#173d38] hover:bg-[#f7f4ed]"}`}
            >
              <Grid2X2 size={16} strokeWidth={1.7} />
              Shop by category
              <ChevronDown size={14} className={`transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
          <Link href="/" className={`text-[11px] uppercase tracking-[0.1em] transition hover:text-[#a98a52] ${pathname === "/" ? "font-semibold text-[#173d38]" : "text-[#52665f]"}`}>Home</Link>
          <span aria-hidden="true" className="h-4 w-px bg-[#e7e0d4]" />
          <div className="flex min-w-0 flex-1 items-center gap-6">
            {featuredNavigation.map((item) => (
              <Link key={item.name} href={item.href} className={`whitespace-nowrap text-[10px] uppercase tracking-[0.1em] transition hover:text-[#a98a52] ${item.sale ? "font-semibold text-[#a34c3b]" : "text-[#52665f]"}`}>
                {item.name}
              </Link>
            ))}
          </div>
          <Link href="/collections" className="ml-auto inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-[#52665f] transition hover:text-[#a98a52]">
            All collections <ArrowUpRight size={13} />
          </Link>
        </div>
      </nav>

      {categoryMenuOpen && (
        <div
          id="desktop-category-menu"
          className="absolute left-0 right-0 top-full hidden border-t border-[#e7e0d4] bg-white shadow-[0_18px_40px_rgba(23,61,56,0.16)] lg:block"
        >
          <div className="mx-auto grid max-w-[1320px] grid-cols-3 gap-5 px-8 py-7">
            {categories.map((category) => {
              const subcategories = category.slug === "mens-fashion" ? menSubcategories : [];
              return (
                <section key={category.slug} className="group/menu min-w-0">
                  <Link
                    href={`/collections/${category.slug}`}
                    onClick={closeMenus}
                    className="flex items-center gap-4 rounded-xl p-2 transition hover:bg-[#f8f6f1]"
                  >
                    <span className="relative h-[72px] w-[88px] shrink-0 overflow-hidden rounded-lg bg-[#f0ede6]">
                      <Image src={category.image} alt="" fill sizes="88px" className="object-cover transition duration-500 group-hover/menu:scale-105" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-[#173d38]">{category.name}</span>
                      <span className="mt-1 block text-[10px] leading-4 text-[#78817b]">{category.description}</span>
                      {category.comingSoon && <span className="mt-2 inline-flex rounded-full bg-[#f0ede6] px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-[#8b7652]">Coming soon</span>}
                    </span>
                    <ArrowUpRight size={15} className="ml-auto shrink-0 text-[#a98a52] opacity-0 transition group-hover/menu:opacity-100" />
                  </Link>
                  {subcategories.length > 0 && (
                    <div className="ml-[104px] mt-1 flex flex-col border-l border-[#e7e0d4] pl-4">
                      {subcategories.map((subcategory) => (
                        <Link
                          key={subcategory}
                          href={getCategoryHref(category, subcategory)}
                          onClick={closeMenus}
                          className="py-1.5 text-[11px] text-[#65756f] transition hover:text-[#173d38]"
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
          <div className="border-t border-[#eee9e0] bg-[#f8f7f3]">
            <div className="mx-auto flex max-w-[1320px] items-center justify-between px-10 py-3 text-[9px] uppercase tracking-[0.16em] text-[#65756f]">
              <span>Thoughtful style, made for everyday life</span>
              <Link href="/shop" onClick={closeMenus} className="inline-flex items-center gap-2 font-medium text-[#173d38] hover:text-[#a98a52]">
                Shop all products <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="absolute left-0 right-0 top-full max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-[#e7e0d4] bg-white px-4 py-4 shadow-[0_18px_40px_rgba(23,61,56,0.16)] lg:hidden">
          <div className="mx-auto max-w-xl">
            <Link href="/" onClick={closeMenus} className="block border-b border-[#eee9e0] py-3 text-sm font-medium text-[#173d38]">Home</Link>
            <p className="pt-4 pb-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8b7652]">Shop by category</p>
            {categories.map((category) => {
              const subcategories = category.slug === "mens-fashion" ? menSubcategories : [];
              const expanded = mobileCategoryOpen === category.slug;
              return (
                <div key={category.slug} className="border-b border-[#eee9e0]">
                  <div className="flex items-center">
                    <Link href={`/collections/${category.slug}`} onClick={closeMenus} className="min-w-0 flex-1 py-3 text-sm font-medium text-[#173d38]">
                      {category.name}
                      {category.comingSoon && <span className="ml-2 text-[8px] font-normal uppercase tracking-[0.12em] text-[#a98a52]">Coming soon</span>}
                    </Link>
                    {subcategories.length > 0 && (
                      <button
                        type="button"
                        aria-label={`${expanded ? "Collapse" : "Expand"} ${category.name} categories`}
                        aria-expanded={expanded}
                        onClick={() => setMobileCategoryOpen(expanded ? null : category.slug)}
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f5f2eb]"
                      >
                        <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  {expanded && (
                    <div className="mb-3 ml-3 flex flex-col border-l border-[#ded6c8] pl-4">
                      {subcategories.map((subcategory) => (
                        <Link key={subcategory} href={getCategoryHref(category, subcategory)} onClick={closeMenus} className="py-2 text-xs text-[#65756f]">
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <p className="pt-5 pb-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8b7652]">Featured</p>
            {featuredNavigation.map((item) => (
              <Link key={item.name} href={item.href} onClick={closeMenus} className={`block border-b border-[#eee9e0] py-3 text-sm ${item.sale ? "text-[#a34c3b]" : "text-[#173d38]"}`}>
                {item.name}
              </Link>
            ))}
            {otherPages.map((item) => (
              <Link key={item.name} href={item.href} onClick={closeMenus} className="block border-b border-[#eee9e0] py-3 text-sm text-[#65756f]">
                {item.name}
              </Link>
            ))}
            <Link href="/account/login" onClick={closeMenus} className="block py-3 text-sm text-[#65756f]">My account</Link>
          </div>
        </div>
      )}
    </header>
  );
}
