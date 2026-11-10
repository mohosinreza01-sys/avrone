import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
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
  return (
    <div className="min-h-[65vh] bg-[#F8F7F4]">
      <h1 className="sr-only">{title}</h1>
      {comingSoon ? (
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16 lg:px-12">
          <div className="rounded-2xl border border-[#e7e0d4] bg-white px-6 py-14 text-center shadow-[0_3px_14px_rgba(23,61,56,0.04)]">
            <p className="text-[9px] uppercase tracking-[0.24em] text-[#a98a52]">Coming soon</p>
            <h2 className="mt-3 text-2xl font-medium text-[#173d38]">A new collection is on its way.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#68736d]">We’re preparing something considered. In the meantime, explore our current men’s collection.</p>
            <Link href="/collections/mens-fashion" className="mt-6 inline-flex bg-[#173d38] px-5 py-3 text-[9px] uppercase tracking-[0.16em] text-white transition hover:bg-[#245b53]">
              Explore men&apos;s fashion
            </Link>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14 lg:px-12">
          <ProductBrowser products={collectionProducts} initialCategory={category ?? "All"} />
        </section>
      )}
    </div>
  );
}
