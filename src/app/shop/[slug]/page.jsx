import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ProductDetails from "@/components/store/ProductDetails";
import { products } from "@/data/products";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
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
  const product = await getProduct(slug);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}

async function getProduct(slug) {
  if (!isSupabaseConfigured()) {
    return products.find((item) => item.slug === slug);
  }

  const { url, key } = getSupabaseConfig();
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase
    .from("products")
    .select("id,slug,name,category,brand,price,compare_at_price,badge,color,sizes,stock,image,description")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("Could not load product details.", error);
    throw new Error("Could not load this product. Check the Supabase catalog configuration.");
  }
  if (!data) return null;
  return { ...data, compareAtPrice: data.compare_at_price };
}
