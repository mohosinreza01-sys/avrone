import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/store/ProductDetails";
import { products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return {
    title: product ? `${product.name} | AVRONE` : "Product | AVRONE",
    description: product?.description,
  };
}

export default function ProductPage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-[65vh] bg-[#F8F7F4]" aria-label="Loading product" />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}

async function ProductPageContent({ params }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
