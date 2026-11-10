"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "@/components/store/ProductCard";

const productFilters = [
  { label: "All pieces", value: "" },
  { label: "New arrivals", value: "new-arrivals" },
  { label: "Best sellers", value: "best-sellers" },
  { label: "Sale", value: "sale" },
];

const getSizeOrder = (size) => {
  const numeric = Number(size);
  if (!Number.isNaN(numeric)) return numeric;
  const order = { XS: 0, S: 1, M: 2, L: 3, XL: 4, XXL: 5 };
  return order[size] ?? 99;
};

export default function ProductBrowser({ products, initialCategory = "All", initialQuery = "", initialFilter = "" }) {
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState(initialFilter);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const colors = [...new Set(products.map((product) => product.color))];
  const brands = [...new Set(products.map((product) => product.brand))];
  const sizes = [...new Set(products.flatMap((product) => product.sizes))].sort((a, b) => getSizeOrder(a) - getSizeOrder(b));

  const toggleArrayValue = (value, setValue) => {
    setValue((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setCategory("All");
    setFilter("");
    setQuery("");
  };

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.category} ${product.color} ${product.brand}`.toLowerCase().includes(normalizedQuery);
      const matchesFilter = filter === "new-arrivals"
        ? product.badge === "New"
        : filter === "best-sellers"
          ? product.badge === "Bestseller"
          : filter === "sale"
            ? Boolean(product.compareAtPrice && product.compareAtPrice > product.price)
            : true;
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesSize = selectedSizes.length === 0 || product.sizes.some((size) => selectedSizes.includes(size));

      return matchesCategory && matchesQuery && matchesFilter && matchesColor && matchesBrand && matchesSize;
    });

    if (sort === "price-low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [category, filter, products, query, selectedBrands, selectedColors, selectedSizes, sort]);

  const hasActiveFilters =
    category !== "All" ||
    filter !== "" ||
    query.trim() !== "" ||
    selectedColors.length > 0 ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0;

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-[#e4dccb] bg-[#fbfaf6] p-4 shadow-[0_8px_24px_rgba(23,61,56,0.04)]">
          <div className="flex items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-2 text-[#173d38]">
              <SlidersHorizontal size={16} />
              <h2 className="text-sm font-medium uppercase tracking-[0.18em]">Filters</h2>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-[#8e7c60] transition hover:text-[#173d38]"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div className="space-y-6 pt-2">
            <div>
              <label htmlFor="product-search" className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#7d7366]">
                Search
              </label>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7d7366]" />
                <input
                  id="product-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search styles"
                  className="w-full rounded-full border border-[#d8d1c4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#173d38] outline-none transition focus:border-[#173d38]"
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#7d7366]">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition ${
                      category === item
                        ? "border-[#173d38] bg-[#173d38] text-white"
                        : "border-[#d8d1c4] bg-white text-[#173d38] hover:border-[#173d38]/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#7d7366]">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleArrayValue(color, setSelectedColors)}
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11px] transition ${
                      selectedColors.includes(color)
                        ? "border-[#173d38] bg-[#173d38] text-white"
                        : "border-[#d8d1c4] bg-white text-[#173d38]"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-black/10"
                      style={{ backgroundColor: color.toLowerCase().includes("white") ? "#f7f3ee" : color.toLowerCase().includes("olive") ? "#6b7c4d" : color.toLowerCase().includes("blue") ? "#2d4c68" : color.toLowerCase().includes("ivory") ? "#efe6d7" : color.toLowerCase().includes("beige") ? "#d9c39f" : color.toLowerCase().includes("charcoal") ? "#2c2a2b" : color.toLowerCase().includes("brown") ? "#7a4b35" : color.toLowerCase().includes("sand") ? "#d2b98f" : color.toLowerCase().includes("midnight") ? "#1b2d3a" : color.toLowerCase().includes("olive") ? "#6a7d57" : "#d3b77f" }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#7d7366]">Brand</p>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex cursor-pointer items-center justify-between gap-3 rounded-full border border-[#e6e0d4] bg-white px-3 py-2 text-sm text-[#173d38]">
                    <span>{brand}</span>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleArrayValue(brand, setSelectedBrands)}
                      className="h-4 w-4 accent-[#173d38]"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#7d7366]">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleArrayValue(size, setSelectedSizes)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition ${
                      selectedSizes.includes(size)
                        ? "border-[#173d38] bg-[#173d38] text-white"
                        : "border-[#d8d1c4] bg-white text-[#173d38] hover:border-[#173d38]/50"
                    }`}
                    aria-label={`Filter by size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Featured collections">
            {productFilters.map((item) => (
              <button
                key={item.value || "all"}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-3 py-2 text-[9px] uppercase tracking-[0.16em] transition ${
                  filter === item.value
                    ? "border-[#173d38] bg-[#173d38] text-white"
                    : "border-[#d8d1c4] bg-white text-[#173d38] hover:border-[#173d38]/60"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#e4dccb] pb-4">
            <p className="text-sm text-[#6d675f]">
              Showing <span className="font-medium text-[#173d38]">{visibleProducts.length}</span> items
            </p>
          </div>

          {visibleProducts.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-[#e4dccb] bg-white px-6 py-16 text-center">
              <p className="font-albert-sans text-3xl text-[#173d38]">No pieces found</p>
              <p className="mt-2 text-sm text-[#6d675f]">Try adjusting your search or removing a filter.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
