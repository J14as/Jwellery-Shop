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
  Check,
} from "lucide-react";
import { useWishlistStore, WishlistItem } from "@/lib/wishlistStore";
import { useCartStore } from "@/lib/cartStore";
import { PricingService } from "@/lib/pricing/PricingService";
import toast from "react-hot-toast";

export default function AccountWishlistPage() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addItemToCart = useCartStore((state) => state.addItem);

  const [addingId, setAddingId] = useState<string | null>(null);

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
    toast.success(`${item.name} added to cart ✨`);
    setTimeout(() => setAddingId(null), 1200);
  };

  if (!mounted) {
    return (
      <div className="glass-card p-8 border border-gold/15 text-center text-white/50 text-xs tracking-widest uppercase">
        Loading Saved Creations...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 md:p-8 border border-gold/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="section-label mb-1 block">Patron Wishlist</span>
          <h2 className="font-serif text-2xl md:text-3xl text-white">
            Saved Creations
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-gold">
          <Sparkles size={14} />
          <span>{items.length} Pieces in Vault</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-12 border border-gold/15 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <Heart size={24} strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-xl text-white mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-white/50 text-sm font-light mb-6 max-w-sm mx-auto">
            Browse our signature collections and curate your private selection.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-dark font-semibold text-xs tracking-widest uppercase hover:bg-gold-light transition-colors"
          >
            <span>Explore High Jewellery</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => {
            const isAdding = addingId === item.id;
            return (
              <div
                key={item.id}
                className="glass-card border border-gold/15 overflow-hidden flex flex-col justify-between group hover:border-gold/40 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-dark-100">
                  <Image
                    src={item.image || "/images/hero-ring.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent opacity-60" />
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast("Removed from Wishlist", { icon: "🤍" });
                    }}
                    aria-label="Remove item"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-dark/80 backdrop-blur-md border border-white/15 text-white/70 hover:text-red-400 transition-colors flex items-center justify-center shadow-md"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="p-5 bg-dark-50 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    {item.metal && (
                      <span className="text-[10px] tracking-widest uppercase text-gold/80 block mb-1">
                        {item.metal}
                      </span>
                    )}
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-serif text-lg text-white hover:text-gold transition-colors block line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <span className="font-serif text-lg font-semibold text-gold mt-1 block">
                      {PricingService.formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gold/10">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`flex-1 py-2.5 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                        isAdding
                          ? "bg-emerald-600 text-white"
                          : "bg-gold text-dark hover:bg-gold-light"
                      }`}
                    >
                      {isAdding ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={13} /> Add to Cart
                        </>
                      )}
                    </button>
                    <Link
                      href={`/products/${item.slug}`}
                      className="px-3.5 py-2.5 border border-white/15 text-white/70 hover:border-gold hover:text-gold text-xs transition-colors flex items-center justify-center"
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
  );
}
