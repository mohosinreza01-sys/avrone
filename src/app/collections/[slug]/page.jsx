import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import ProductBrowser from "@/components/store/ProductBrowser";
import { collectionSlugs, products } from "@/data/products";
import { categories } from "@/data/categories";

export function generateStaticParams() {
  return [
    ...Object.values(collectionSlugs).map((slug) => ({ slug })),
    ...categories.map(({ slug }) => ({ slug })),
    { slug: "winter-collection" },
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug)?.name
    ?? Object.entries(collectionSlugs).find(([, value]) => value === slug)?.[0]
    ?? (slug === "winter-collection" ? "Winter Collection" : null);
  return {
    title: category ? `${category} | AVRONE` : "Collection | AVRONE",
  };
}

export default function CollectionPage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-[65vh] bg-[#F8F7F4]" aria-label="Loading collection" />}>
      <CollectionPageContent params={params} />
    </Suspense>
  );
}

async function CollectionPageContent({ params }) {
  const { slug } = await params;
  const parentCategory = categories.find((item) => item.slug === slug);
  const category = Object.entries(collectionSlugs).find(([, value]) => value === slug)?.[0];
  const winterCollection = slug === "winter-collection";
  if (!parentCategory && !category && !winterCollection) notFound();

  const collectionProducts = parentCategory
    ? products.filter((product) => parentCategory.productCategories.includes(product.category))
    : products.filter((product) => product.category === category);
  const title = parentCategory?.name ?? category ?? "Winter Collection";
  const comingSoon = Boolean(parentCategory?.comingSoon || winterCollection);
  const comingSoonMessage = parentCategory?.comingSoonMessage
    ?? "Our winter collection is on its way.";
  const comingSoonDetails = parentCategory?.comingSoonDetails
    ?? "We're getting our next collection ready. It's not available to shop yet, but you can explore the styles currently in store.";
  const comingSoonImage = parentCategory?.image ?? "/images/avrone-winter-campaign.png";
  return (
    <div className="min-h-[65vh] bg-[#F8F7F4]">
      <h1 className="sr-only">{title}</h1>
      {comingSoon ? (
        <section className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12 lg:px-12">
          <Link href="/collections" className="mb-5 inline-flex items-center gap-2 text-sm text-[#68736d] transition hover:text-[#173d38]">
            <ArrowLeft size={16} aria-hidden="true" />
            All collections
          </Link>
          <div className="grid overflow-hidden rounded-3xl border border-[#e7e0d4] bg-white shadow-[0_8px_30px_rgba(23,61,56,0.07)] lg:min-h-[440px] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[220px] bg-[#e9e5db] sm:min-h-[300px] lg:min-h-full">
              <Image
                src={comingSoonImage}
                alt={`${title} collection preview`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173d38]/65 via-[#173d38]/10 to-transparent" />
              <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-3 py-2 text-xs font-medium text-[#173d38] backdrop-blur-sm">
                <Sparkles size={15} className="text-[#a98a52]" aria-hidden="true" />
                A new AVRONE collection
              </div>
            </div>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f7f3e9] px-3 py-1.5 text-xs font-medium text-[#8b7652]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#b99458]" />
                Coming soon
              </p>
              <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#173d38] sm:text-4xl">
                {comingSoonMessage}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#68736d]">
                {comingSoonDetails}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/shop" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#173d38] px-6 text-sm font-medium text-white transition hover:bg-[#245b53]">
                  Browse available styles
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/collections" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ded6c8] px-6 text-sm font-medium text-[#173d38] transition hover:border-[#b99458] hover:bg-[#fbfaf7]">
                  View all collections
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14 lg:px-12">
          <ProductBrowser
            products={collectionProducts}
            initialCategory={category ?? "All"}
            categoryFilter={parentCategory?.productCategories ?? (category ? [category] : null)}
          />
        </section>
      )}
    </div>
  );
}
