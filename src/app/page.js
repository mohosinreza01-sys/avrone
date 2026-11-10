import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, RefreshCw, Sparkles, Truck } from "lucide-react";
import HomeHeroCarousel from "@/components/home/HomeHeroCarousel";
import HomepageProductSection from "@/components/home/HomepageProductSection";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

const features = [
  { label: "7-day exchanges", Icon: RefreshCw },
  { label: "New-season styles", Icon: Sparkles },
  { label: "Free delivery over ৳3,000", Icon: Truck },
  { label: "Easy 7-day return", Icon: RefreshCw },
];

export default function HomePage() {
  const offer = products.find((product) => product.compareAtPrice);
  const discount = offer
    ? Math.round((1 - offer.price / offer.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-white">
      <HomeHeroCarousel offerPercent={discount} />

      <HomepageProductSection
        eyebrow="Fresh from the studio"
        title="New Arrivals"
        description="Meet the latest pieces, designed for the everyday and made to wear on repeat."
        products={products.slice(4, 8)}
        href="/shop"
        linkText="Shop all new"
      />

      <section className="bg-[#f7f7f3] px-5 py-12 md:px-10 md:py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="relative mb-8 flex min-h-[300px] flex-col items-center justify-center overflow-hidden border-b-2 border-[#b99458] bg-[#173d38] px-5 py-12 text-center sm:px-8 md:mb-10 md:min-h-[340px] md:py-16">
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07] sm:h-[360px] sm:w-[360px] md:h-[440px] md:w-[440px]" />
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05] sm:h-[300px] sm:w-[300px] md:h-[370px] md:w-[370px]" />
            <div className="relative flex flex-col items-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#d3b77f]/35 bg-white/[0.04] px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.25em] text-[#e2c78e] sm:text-[9px]">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#d3b77f]" />
                The AVRONE edit
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#d3b77f]" />
              </p>
              <h2 className="mt-5 max-w-4xl font-albert-sans text-[clamp(2.25rem,7vw,5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-[#fffdf7]">
                Shop the Collection
              </h2>
              <span aria-hidden="true" className="mt-5 h-px w-12 bg-[#d3b77f]" />
              <p className="mt-4 max-w-xl text-xs leading-6 text-[#e2e8e1] sm:text-sm">
                Panjabi and everyday styles, thoughtfully chosen for life in Bangladesh.
              </p>
              <Link
                href="/collections"
                className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-full border border-[#d3b77f]/70 bg-[#d3b77f] px-6 text-[9px] font-medium uppercase tracking-[0.16em] text-[#173d38] transition hover:border-[#e3d1ad] hover:bg-[#e3d1ad]"
              >
                Explore collections <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-5">
            {categories.map((category, index) => (
              <Link
                href={`/collections/${category.slug}`}
                key={category.name}
                className="group min-w-0 rounded-2xl border border-[#e7e0d4] bg-white p-2 shadow-[0_3px_14px_rgba(23,61,56,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#c5aa79] hover:shadow-[0_12px_28px_rgba(23,61,56,0.1)] sm:p-2.5"
              >
                  <div className="relative aspect-[1.18] overflow-hidden rounded-xl bg-[#e9e9e2]">
                    <Image
                      src={category.image}
                      alt={`${category.name} collection`}
                      fill
                      sizes="33vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#173d38] shadow-sm transition group-hover:bg-[#173d38] group-hover:text-white">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 min-h-8 text-[10px] font-medium leading-4 text-[#173d38] sm:text-sm md:text-base">{category.name}</h3>
                      <p className="mt-1 truncate text-[9px] leading-4 text-[#78817b] sm:text-[10px]">{category.description}</p>
                    </div>
                    <span className="shrink-0 text-[9px] tracking-[0.12em] text-[#a98a52]">
                      0{index + 1}
                    </span>
                  </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
