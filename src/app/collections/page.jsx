import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";

export const metadata = { title: "Collections | AVRONE" };

export default function CollectionsPage() {
  return (
    <div className="min-h-[65vh] bg-[#F8F7F4]">
      <h1 className="sr-only">AVRONE collections</h1>
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14 lg:px-12">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:gap-5">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="group min-w-0 rounded-2xl border border-[#e7e0d4] bg-white p-2 shadow-[0_3px_14px_rgba(23,61,56,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#c5aa79] hover:shadow-[0_12px_28px_rgba(23,61,56,0.1)] sm:p-2.5"
            >
              <div className="relative aspect-[1.18] overflow-hidden rounded-xl bg-[#EAE7E1]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="33vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.06]"
                />
                <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#173d38] shadow-sm transition group-hover:bg-[#173d38] group-hover:text-white">
                  <ArrowUpRight size={15} />
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3">
                <div className="min-w-0">
                  <h2 className="line-clamp-2 min-h-8 text-[10px] font-medium leading-4 text-[#173d38] sm:text-sm md:text-base">{category.name}</h2>
                  <p className="mt-1 truncate text-[9px] leading-4 text-[#78817b] sm:text-[10px]">{category.description}</p>
                </div>
                <span className="shrink-0 text-[9px] tracking-[0.12em] text-[#a98a52]">0{index + 1}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
