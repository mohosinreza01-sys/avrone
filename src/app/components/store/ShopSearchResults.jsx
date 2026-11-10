"use client";

import { useSearchParams } from "next/navigation";
import ProductBrowser from "@/components/store/ProductBrowser";

export default function ShopSearchResults({ products }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("search") ?? "";
  const requestedFilter = searchParams.get("filter") ?? "";
  const filter = ["new-arrivals", "best-sellers", "sale"].includes(requestedFilter)
    ? requestedFilter
    : "";
  return <ProductBrowser key={`${query}-${filter}`} products={products} initialQuery={query} initialFilter={filter} />;
}
