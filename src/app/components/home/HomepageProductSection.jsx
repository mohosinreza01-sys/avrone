"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import ProductCard from "@/components/store/ProductCard";
import { useStore } from "@/components/store/StoreProvider";

export default function HomepageProductSection({
  products: initialProducts,
  eyebrow,
  title,
  description,
  href = "/shop",
  linkText = "Shop all",
  tone = "light",
}) {
  const dark = tone === "dark";
  const productTrack = useRef(null);
  const { catalog, catalogLoaded } = useStore();
  const products = catalogLoaded
    ? catalog.filter((product) => product.active && product.badge === "New").slice(0, 8)
    : initialProducts;

  function scrollProducts(direction) {
    if (!productTrack.current) return;
    productTrack.current.scrollBy({
      left: direction * productTrack.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  return (
    <section className={dark ? "border-y border-[#c8b58f]/60 bg-[#f5f0e6]" : "bg-[#fbfaf7]"}>
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:px-12">
        <div className="mb-9 flex flex-col items-center text-center md:mb-11">
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden="true" className={`h-px w-8 ${dark ? "bg-[#a98a52]" : "bg-[#b99458]"}`} />
            <p className={`text-[9px] font-medium uppercase tracking-[0.3em] ${dark ? "text-[#806b47]" : "text-[#8b7652]"}`}>
              {eyebrow}
            </p>
            <span aria-hidden="true" className={`h-px w-8 ${dark ? "bg-[#a98a52]" : "bg-[#b99458]"}`} />
          </div>
          <h2 className="mt-3 text-3xl font-medium leading-tight tracking-[-0.035em] text-[#173d38] md:text-5xl">
            {title}
          </h2>
          {description && (
            <p className={`mt-3 max-w-xl text-sm leading-6 ${dark ? "text-[#5d6258]" : "text-[#68736d]"}`}>
              {description}
            </p>
          )}
          <div className="mt-5 flex items-center justify-center gap-4">
            <Link href={href} className={`inline-flex min-h-10 items-center gap-2 border px-4 text-[9px] font-medium uppercase tracking-[0.16em] transition ${dark ? "border-[#a98a52]/60 text-[#173d38] hover:bg-[#173d38] hover:text-white" : "border-[#b99458]/60 text-[#173d38] hover:bg-[#173d38] hover:text-white"}`}>
              {linkText} <ArrowUpRight size={14} />
            </Link>
            <div className="flex gap-2">
              <button type="button" onClick={() => scrollProducts(-1)} aria-label={`Previous ${title}`} className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${dark ? "border-[#c8b58f] text-[#173d38] hover:bg-[#173d38] hover:text-white" : "border-[#173d38]/15 text-[#173d38] hover:border-[#173d38] hover:bg-white"}`}>
                <ArrowLeft size={15} />
              </button>
              <button type="button" onClick={() => scrollProducts(1)} aria-label={`Next ${title}`} className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${dark ? "border-[#c8b58f] text-[#173d38] hover:bg-[#173d38] hover:text-white" : "border-[#173d38]/15 text-[#173d38] hover:border-[#173d38] hover:bg-white"}`}>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
        <div ref={productTrack} className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 scrollbar-none md:mx-0 md:gap-6 md:px-0">
          {products.map((product) => (
            <div key={product.id} className="w-[72vw] max-w-[300px] shrink-0 snap-start sm:w-[42vw] md:w-[31%] lg:w-[23.5%]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
