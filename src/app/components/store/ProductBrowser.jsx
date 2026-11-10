"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/store/ProductCard";

const productFilters = [
  { label: "All pieces", value: "" },
  { label: "New arrivals", value: "new-arrivals" },
  { label: "Best sellers", value: "best-sellers" },
  { label: "Sale", value: "sale" },
];

export default function ProductBrowser({ products, initialCategory = "All", initialQuery = "", initialFilter = "" }) {
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState(initialFilter);
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(normalizedQuery);
      const matchesFilter = filter === "new-arrivals"
        ? product.badge === "New"
        : filter === "best-sellers"
          ? product.badge === "Bestseller"
          : filter === "sale"
            ? Boolean(product.compareAtPrice && product.compareAtPrice > product.price)
            : true;
      return matchesCategory && matchesQuery && matchesFilter;
    });

    if (sort === "price-low") return filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-high") return filtered.sort((a, b) => b.price - a.price);
    if (sort === "name") return filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [category, filter, products, query, sort]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-5 border-b border-black/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2" aria-label="Featured collections">
            {productFilters.map((item) => (
              <button
                key={item.value || "all"}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-3 py-2 text-[9px] uppercase tracking-[0.14em] transition ${
                  filter === item.value
                    ? "border-[#173d38] bg-[#173d38] text-white"
                    : "border-[#173d38]/15 text-[#173d38] hover:border-[#173d38]/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition ${
                  category === item
                    ? "border-[#111820] bg-[#111820] text-white"
                    : "border-black/10 text-[#111820] hover:border-black/40"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="product-search">Search products</label>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the collection"
            className="min-w-0 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#111820] sm:w-56"
          />
          <label className="sr-only" htmlFor="product-sort">Sort products</label>
          <select
            id="product-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#111820]"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      <p className="mb-5 text-xs text-gray-500">{visibleProducts.length} pieces</p>
      {visibleProducts.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-black/5 bg-white px-6 py-16 text-center">
          <p className="font-serif text-2xl text-[#111820]">No pieces found</p>
          <p className="mt-2 text-sm text-gray-500">Try another search or category.</p>
        </div>
      )}
    </>
  );
}
