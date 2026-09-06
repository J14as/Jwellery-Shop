"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Sparkles,
  ArrowRight,
  Share2,
  Check,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { useWishlistStore, WishlistItem } from "@/lib/wishlistStore";
import { useCartStore } from "@/lib/cartStore";
import { PricingService } from "@/lib/pricing/PricingService";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";
import { ProductCard } from "@/components/ProductCard";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addItemToCart = useCartStore((state) => state.addItem);

  const [addingId, setAddingId] = useState<string | null>(null);
  const [movingAll, setMovingAll] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item: WishlistItem) => {
    setAddingId(item.id);
    addItemToCart({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      quantity: 1,
      metal: item.metal,
    });
    toast.success(`${item.name} added to your shopping bag ✨`);
    setTimeout(() => setAddingId(null), 1200);
  };

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;
    setMovingAll(true);
    items.forEach((item) => {
      addItemToCart({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        quantity: 1,
        metal: item.metal,
      });
    });
    toast.success(`All ${items.length} creations moved to your cart! 🛍️`);
    setTimeout(() => setMovingAll(false), 1200);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied to clipboard ✨");
    }
  };

  const recommendedProducts = MOCK_PRODUCTS.slice(0, 3);

  if (!mounted) {
    return (
      <div className="bg-dark min-h-screen pt-12 pb-28 text-white flex items-center justify-center">
        <div className="animate-pulse text-gold tracking-widest uppercase text-xs">
          Loading Saved Creations...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen pt-8 pb-28 text-white">
      {/* Breadcrumb */}
      <div className="container-custom mb-8">
        <nav className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/40">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-gold font-medium">Curated Wishlist</span>
        </nav>
      </div>

      {/* Hero Header */}
      <div className="container-custom mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-gold/15 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-gold" />
              <span className="section-label">Private Sanctuary</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white">
              Curated Wishlist
            </h1>
            <p className="text-white/50 text-sm font-light mt-1">
              {items.length === 1
                ? "1 masterpiece saved for your consideration"
                : `${items.length} masterpieces saved for your consideration`}
            </p>
          </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleShare}
                className="px-4 py-2.5 border border-white/15 hover:border-gold text-white/70 hover:text-white text-xs tracking-widest uppercase transition-colors flex items-center gap-2"
              >
                <Share2 size={14} />
                <span>Share List</span>
              </button>
              <button
                onClick={() => {
                  clearWishlist();
                  toast("Wishlist cleared", { icon: "🧹" });
                }}
                className="px-4 py-2.5 border border-white/15 hover:border-red-400/40 text-white/50 hover:text-red-400 text-xs tracking-widest uppercase transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
              <button
                onClick={handleMoveAllToCart}
                disabled={movingAll}
                className="px-5 py-2.5 bg-gold text-dark hover:bg-gold-light text-xs tracking-widest uppercase font-semibold transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                {movingAll ? (
                  <>
                    <Check size={14} /> Moved to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} /> Move All to Bag
                  </>
                )}
              </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom mb-24">
        {items.length === 0 ? (
          /* Empty Wishlist State */
          <div className="glass-card p-12 md:p-16 border border-gold/15 text-center max-w-2xl mx-auto my-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              <Heart size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-3">
              Your Wishlist Awaits Its First Gem
            </h2>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-8 max-w-md mx-auto">
              You haven&apos;t saved any creations yet. Explore our handcrafted
              haute joaillerie collections and save your desires.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/categories/rings"
                className="px-5 py-3 bg-gold text-dark hover:bg-gold-light text-xs tracking-widest uppercase font-semibold transition-colors"
              >
                Explore Rings
              </Link>
              <Link
                href="/categories/necklaces"
                className="px-5 py-3 border border-gold/30 text-gold hover:bg-gold/10 text-xs tracking-widest uppercase font-medium transition-colors"
              >
                Necklaces
              </Link>
              <Link
                href="/categories/earrings"
                className="px-5 py-3 border border-gold/30 text-gold hover:bg-gold/10 text-xs tracking-widest uppercase font-medium transition-colors"
              >
                Earrings
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => {
              const isAddingThis = addingId === item.id;
              const hasDiscount =
                item.originalPrice && item.originalPrice > item.price;
              const discountPct = hasDiscount
                ? Math.round(
                    ((item.originalPrice! - item.price) /
                      item.originalPrice!) *
                      100
                  )
                : 0;

              return (
                <div
                  key={item.id}
                  className="glass-card border border-gold/15 overflow-hidden group flex flex-col justify-between hover:border-gold/40 transition-all duration-500"
                >
                  {/* Top Image Box */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-dark-100">
                    <Image
                      src={item.image || "/images/hero-ring.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent opacity-60" />

                    {/* Discount badge */}
                    {discountPct > 0 && (
                      <span className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium z-10">
                        {discountPct}% OFF
                      </span>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast("Removed from Wishlist", { icon: "🤍" });
                      }}
                      aria-label="Remove item"
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-dark/80 backdrop-blur-md border border-white/15 text-white/70 hover:text-red-400 hover:border-red-400/40 transition-all flex items-center justify-center shadow-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Info Box */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-dark-50">
                    <div className="mb-4">
                      {item.metal && (
                        <span className="text-[10px] tracking-widest uppercase text-gold/80 block mb-1">
                          {item.metal}
                        </span>
                      )}
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-serif text-lg text-white group-hover:text-gold transition-colors block line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-baseline gap-2.5 mt-2">
                        <span className="font-serif text-lg font-semibold text-white">
                          {PricingService.formatPrice(item.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-white/30 line-through">
                            {PricingService.formatPrice(item.originalPrice!)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gold/10">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`flex-1 py-3 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                          isAddingThis
                            ? "bg-emerald-600 text-white"
                            : "bg-gold text-dark hover:bg-gold-light"
                        }`}
                      >
                        {isAddingThis ? (
                          <>
                            <Check size={14} /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={13} /> Add to Bag
                          </>
                        )}
                      </button>
                      <Link
                        href={`/products/${item.slug}`}
                        className="px-3.5 py-3 border border-white/15 text-white/70 hover:border-gold hover:text-gold text-xs tracking-widest uppercase transition-colors flex items-center justify-center"
                        title="View Details"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-gold/10">
          <div>
            <span className="section-label mb-1 block">Curated For You</span>
            <h2 className="font-serif text-2xl md:text-3xl text-white">
              Recommended Masterpieces
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs text-gold/80 hover:text-gold tracking-widest uppercase flex items-center gap-1 font-medium transition-colors"
          >
            All Collections <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendedProducts.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              sellingPrice={p.sellingPrice}
              mrp={p.mrp}
              discount={p.discount}
              images={p.images}
              featured={p.featured}
              bestSeller={p.bestSeller}
              newArrival={p.newArrival}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
