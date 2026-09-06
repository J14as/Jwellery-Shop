"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductItem } from "@/lib/mockProducts";
import { SlidersHorizontal, X, RotateCcw, Sparkles } from "lucide-react";

interface CategoryFilterViewProps {
  initialProducts: ProductItem[];
  categoryName: string;
  categorySlug: string;
}

type PurityFilter = "all" | "18k" | "22k" | "solitaires";
type PriceFilter = "all" | "under-100k" | "100k-200k" | "above-200k";
type TagFilter = "all" | "bestseller" | "newArrival";
type SortOption = "newest" | "bestseller" | "price_asc" | "price_desc" | "rating";

export function CategoryFilterView({
  initialProducts,
  categoryName,
  categorySlug: _categorySlug,
}: CategoryFilterViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial states from URL if present
  const initialPurity = (searchParams.get("purity") as PurityFilter) || "all";
  const initialPrice = (searchParams.get("price") as PriceFilter) || "all";
  const initialTag = (searchParams.get("tag") as TagFilter) || "all";
  const initialSort = (searchParams.get("sort") as SortOption) || "newest";

  const [purity, setPurity] = useState<PurityFilter>(initialPurity);
  const [price, setPrice] = useState<PriceFilter>(initialPrice);
  const [tag, setTag] = useState<TagFilter>(initialTag);
  const [sort, setSort] = useState<SortOption>(initialSort);

  // Sync state if URL searchParams change
  useEffect(() => {
    const urlPurity = (searchParams.get("purity") as PurityFilter) || "all";
    const urlPrice = (searchParams.get("price") as PriceFilter) || "all";
    const urlTag = (searchParams.get("tag") as TagFilter) || "all";
    const urlSort = (searchParams.get("sort") as SortOption) || "newest";

    setPurity(urlPurity);
    setPrice(urlPrice);
    setTag(urlTag);
    setSort(urlSort);
  }, [searchParams]);

  // Helper to update URL query params cleanly
  const updateUrl = (
    newPurity: PurityFilter,
    newPrice: PriceFilter,
    newTag: TagFilter,
    newSort: SortOption
  ) => {
    const params = new URLSearchParams();
    if (newPurity !== "all") params.set("purity", newPurity);
    if (newPrice !== "all") params.set("price", newPrice);
    if (newTag !== "all") params.set("tag", newTag);
    if (newSort !== "newest") params.set("sort", newSort);

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetUrl, { scroll: false });
  };

  const handlePurityChange = (val: PurityFilter) => {
    setPurity(val);
    updateUrl(val, price, tag, sort);
  };

  const handlePriceChange = (val: PriceFilter) => {
    setPrice(val);
    updateUrl(purity, val, tag, sort);
  };

  const handleTagChange = (val: TagFilter) => {
    setTag(val);
    updateUrl(purity, price, val, sort);
  };

  const handleSortChange = (val: SortOption) => {
    setSort(val);
    updateUrl(purity, price, tag, val);
  };

  const handleResetFilters = () => {
    setPurity("all");
    setPrice("all");
    setTag("all");
    setSort("newest");
    router.replace(pathname, { scroll: false });
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // 1. Purity / Metal Filter
    if (purity === "18k") {
      list = list.filter(
        (p) =>
          p.metalPurity?.includes("18K") ||
          p.metalType?.toLowerCase().includes("18k")
      );
    } else if (purity === "22k") {
      list = list.filter(
        (p) =>
          p.metalPurity?.includes("22K") ||
          p.metalType?.toLowerCase().includes("22k")
      );
    } else if (purity === "solitaires") {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes("solitaire") ||
          p.description.toLowerCase().includes("solitaire") ||
          p.shortDescription?.toLowerCase().includes("solitaire")
      );
    }

    // 2. Price Filter
    if (price === "under-100k") {
      list = list.filter((p) => p.sellingPrice < 100000);
    } else if (price === "100k-200k") {
      list = list.filter((p) => p.sellingPrice >= 100000 && p.sellingPrice <= 200000);
    } else if (price === "above-200k") {
      list = list.filter((p) => p.sellingPrice > 200000);
    }

    // 3. Tag Filter
    if (tag === "bestseller") {
      list = list.filter((p) => p.bestSeller);
    } else if (tag === "newArrival") {
      list = list.filter((p) => p.newArrival);
    }

    // 4. Sorting
    list.sort((a, b) => {
      if (sort === "price_asc") return a.sellingPrice - b.sellingPrice;
      if (sort === "price_desc") return b.sellingPrice - a.sellingPrice;
      if (sort === "bestseller") return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      // "newest"
      return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
    });

    return list;
  }, [initialProducts, purity, price, tag, sort]);

  const hasActiveFilters = purity !== "all" || price !== "all" || tag !== "all";

  return (
    <div className="w-full">
      {/* Filter & Sort Bar */}
      <div className="mb-8 space-y-4">
        <div className="p-4 md:p-5 glass-card border border-gold/15 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs uppercase tracking-wider">
          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-gold font-medium mr-1">
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </div>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            {/* Purity Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePurityChange("all")}
                className={`px-3 py-1.5 border transition-all duration-200 ${
                  purity === "all"
                    ? "bg-gold text-dark font-semibold border-gold shadow-sm"
                    : "bg-dark-50 text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
                }`}
              >
                All Purity
              </button>
              <button
                type="button"
                onClick={() => handlePurityChange("18k")}
                className={`px-3 py-1.5 border transition-all duration-200 ${
                  purity === "18k"
                    ? "bg-gold text-dark font-semibold border-gold shadow-sm"
                    : "bg-dark-50 text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
                }`}
              >
                18K Gold
              </button>
              <button
                type="button"
                onClick={() => handlePurityChange("22k")}
                className={`px-3 py-1.5 border transition-all duration-200 ${
                  purity === "22k"
                    ? "bg-gold text-dark font-semibold border-gold shadow-sm"
                    : "bg-dark-50 text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
                }`}
              >
                22K Gold
              </button>
              <button
                type="button"
                onClick={() => handlePurityChange("solitaires")}
                className={`px-3 py-1.5 border transition-all duration-200 ${
                  purity === "solitaires"
                    ? "bg-gold text-dark font-semibold border-gold shadow-sm"
                    : "bg-dark-50 text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
                }`}
              >
                Solitaires
              </button>
            </div>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            {/* Price Dropdown / Quick filter */}
            <div className="flex items-center gap-2">
              <select
                value={price}
                onChange={(e) => handlePriceChange(e.target.value as PriceFilter)}
                className="bg-dark-50 text-white/80 text-xs border border-white/10 hover:border-gold/40 px-3 py-1.5 focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under-100k">Under ₹1,00,000</option>
                <option value="100k-200k">₹1,00,000 – ₹2,00,000</option>
                <option value="above-200k">Above ₹2,00,000</option>
              </select>
            </div>

            {/* Collection Tag Filter */}
            <div className="flex items-center gap-2">
              <select
                value={tag}
                onChange={(e) => handleTagChange(e.target.value as TagFilter)}
                className="bg-dark-50 text-white/80 text-xs border border-white/10 hover:border-gold/40 px-3 py-1.5 focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="all">All Collections</option>
                <option value="bestseller">Bestsellers Only</option>
                <option value="newArrival">New Arrivals Only</option>
              </select>
            </div>
          </div>

          {/* Sort Menu & Counter */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
            <span className="text-white/40 text-[11px] font-sans">
              {filteredProducts.length} of {initialProducts.length} items
            </span>

            <div className="flex items-center gap-2">
              <span className="text-white/40">Sort:</span>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="bg-dark-50 text-white text-xs border border-gold/30 px-3 py-1.5 focus:outline-none focus:border-gold cursor-pointer font-medium"
              >
                <option value="newest">Newest Releases</option>
                <option value="bestseller">Most Desired</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 px-2">
            <span className="text-xs text-white/40 uppercase tracking-wider">Active:</span>

            {purity !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs">
                <span>Purity: {purity === "solitaires" ? "Solitaires" : purity.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={() => handlePurityChange("all")}
                  aria-label="Remove purity filter"
                  className="hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {price !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs">
                <span>
                  Price:{" "}
                  {price === "under-100k"
                    ? "Under ₹1L"
                    : price === "100k-200k"
                    ? "₹1L – ₹2L"
                    : "Above ₹2L"}
                </span>
                <button
                  type="button"
                  onClick={() => handlePriceChange("all")}
                  aria-label="Remove price filter"
                  className="hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {tag !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs">
                <span>Tag: {tag === "bestseller" ? "Bestsellers" : "New Arrivals"}</span>
                <button
                  type="button"
                  onClick={() => handleTagChange("all")}
                  aria-label="Remove tag filter"
                  className="hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-gold uppercase tracking-wider underline underline-offset-4 ml-2 transition-colors"
            >
              <RotateCcw size={11} /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              sellingPrice={product.sellingPrice}
              mrp={product.mrp}
              discount={product.discount}
              images={product.images}
              featured={product.featured}
              bestSeller={product.bestSeller}
              newArrival={product.newArrival}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card border border-gold/15 max-w-xl mx-auto px-6">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4 text-gold">
            <Sparkles size={20} />
          </div>
          <h3 className="font-serif text-2xl text-white mb-2">No creations matched</h3>
          <p className="text-white/60 text-sm mb-6 font-light">
            We couldn&apos;t find any {categoryName.toLowerCase()} matching your active filter criteria. Try adjusting your purity, price, or sort settings.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn-gold text-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
