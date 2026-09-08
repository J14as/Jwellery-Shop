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

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const hasActiveFilters = purity !== "all" || price !== "all" || tag !== "all";

  return (
    <div className="w-full">
      {/* ── Mobile Quick Filter Pills (Horizontal Scroll) ── */}
      <div className="lg:hidden mb-4 overflow-x-auto scrollbar-hide touch-scroll flex items-center gap-2 pb-1">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className={`flex-shrink-0 px-3.5 py-2 border flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase ${
            hasActiveFilters
              ? "bg-gold text-dark border-gold font-bold shadow-md"
              : "bg-dark-50 text-gold border-gold/30"
          }`}
        >
          <SlidersHorizontal size={13} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-4 h-4 rounded-full bg-dark text-gold text-[10px] flex items-center justify-center font-bold">
              {[purity !== "all", price !== "all", tag !== "all"].filter(Boolean).length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handlePurityChange(purity === "18k" ? "all" : "18k")}
          className={`flex-shrink-0 px-3 py-2 border text-xs tracking-wider uppercase transition-colors ${
            purity === "18k"
              ? "bg-gold text-dark font-semibold border-gold"
              : "bg-dark-50 text-white/70 border-white/10"
          }`}
        >
          18K Gold
        </button>

        <button
          type="button"
          onClick={() => handlePurityChange(purity === "22k" ? "all" : "22k")}
          className={`flex-shrink-0 px-3 py-2 border text-xs tracking-wider uppercase transition-colors ${
            purity === "22k"
              ? "bg-gold text-dark font-semibold border-gold"
              : "bg-dark-50 text-white/70 border-white/10"
          }`}
        >
          22K Gold
        </button>

        <button
          type="button"
          onClick={() => handlePurityChange(purity === "solitaires" ? "all" : "solitaires")}
          className={`flex-shrink-0 px-3 py-2 border text-xs tracking-wider uppercase transition-colors ${
            purity === "solitaires"
              ? "bg-gold text-dark font-semibold border-gold"
              : "bg-dark-50 text-white/70 border-white/10"
          }`}
        >
          Solitaires
        </button>

        <button
          type="button"
          onClick={() => handleTagChange(tag === "bestseller" ? "all" : "bestseller")}
          className={`flex-shrink-0 px-3 py-2 border text-xs tracking-wider uppercase transition-colors ${
            tag === "bestseller"
              ? "bg-gold text-dark font-semibold border-gold"
              : "bg-dark-50 text-white/70 border-white/10"
          }`}
        >
          Bestsellers
        </button>
      </div>

      {/* ── Mobile Sort & Count Bar ── */}
      <div className="lg:hidden mb-6 flex items-center justify-between p-3 bg-dark-50 border border-gold/15 text-xs">
        <span className="text-white/40 text-[11px]">
          {filteredProducts.length} pieces found
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-[11px] uppercase">Sort:</span>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="bg-transparent text-gold text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="newest" className="bg-dark text-white">Newest</option>
            <option value="bestseller" className="bg-dark text-white">Most Desired</option>
            <option value="price_asc" className="bg-dark text-white">Price: Low to High</option>
            <option value="price_desc" className="bg-dark text-white">Price: High to Low</option>
            <option value="rating" className="bg-dark text-white">Top Rated</option>
          </select>
        </div>
      </div>

      {/* ── Desktop Filter & Sort Bar ── */}
      <div className="mb-8 space-y-4">
        <div className="hidden lg:flex p-5 glass-card border border-gold/15 flex-row justify-between items-center gap-4 text-xs uppercase tracking-wider">
          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gold font-medium mr-1">
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </div>

            <div className="h-4 w-px bg-white/10" />

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

            <div className="h-4 w-px bg-white/10" />

            {/* Price Dropdown */}
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
          <div className="flex items-center gap-4">
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

      {/* ── Mobile Filter Modal Drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border-t border-gold/30 rounded-t-2xl max-h-[85vh] overflow-y-auto touch-scroll p-6 space-y-6 animate-fade-up">
            <div className="flex items-center justify-between pb-4 border-b border-gold/15">
              <div className="flex items-center gap-2 text-gold font-serif text-lg">
                <SlidersHorizontal size={18} />
                <span>Filter Creations</span>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Purity Section */}
            <div>
              <span className="text-[11px] tracking-widest uppercase text-white/50 block mb-3 font-semibold">
                Metal Purity
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "all", label: "All Purity" },
                  { id: "18k", label: "18K Gold" },
                  { id: "22k", label: "22K Gold" },
                  { id: "solitaires", label: "Solitaires" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePurityChange(item.id as PurityFilter)}
                    className={`py-3 px-3 text-xs tracking-wider uppercase border text-center transition-colors ${
                      purity === item.id
                        ? "bg-gold text-dark font-bold border-gold"
                        : "bg-dark-50 text-white/70 border-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Section */}
            <div>
              <span className="text-[11px] tracking-widest uppercase text-white/50 block mb-3 font-semibold">
                Price Range
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: "all", label: "All Price Ranges" },
                  { id: "under-100k", label: "Under ₹1,00,000" },
                  { id: "100k-200k", label: "₹1,00,000 – ₹2,00,000" },
                  { id: "above-200k", label: "Above ₹2,00,000" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePriceChange(item.id as PriceFilter)}
                    className={`py-3 px-4 text-xs tracking-wider uppercase border text-left flex justify-between items-center transition-colors ${
                      price === item.id
                        ? "bg-gold text-dark font-bold border-gold"
                        : "bg-dark-50 text-white/70 border-white/10"
                    }`}
                  >
                    <span>{item.label}</span>
                    {price === item.id && <span className="text-dark font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Section */}
            <div>
              <span className="text-[11px] tracking-widest uppercase text-white/50 block mb-3 font-semibold">
                Collection Type
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "bestseller", label: "Bestseller" },
                  { id: "newArrival", label: "New Arrival" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTagChange(item.id as TagFilter)}
                    className={`py-2.5 px-2 text-[11px] tracking-wider uppercase border text-center transition-colors ${
                      tag === item.id
                        ? "bg-gold text-dark font-bold border-gold"
                        : "bg-dark-50 text-white/70 border-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gold/15 flex gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-outline flex-1 py-3.5 text-xs border-white/20 text-white/70"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="btn-gold flex-1 py-3.5 text-xs font-semibold"
              >
                View {filteredProducts.length} Items
              </button>
            </div>
          </div>
        </div>
      )}

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
