"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { PricingService } from "@/lib/pricing/PricingService";
import { TiltCard } from "@/components/ui/TiltCard";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sellingPrice: number;
  mrp?: number;
  discount?: number;
  images: Array<{ imageUrl: string; altText?: string | null }>;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  rating?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  sellingPrice,
  mrp = sellingPrice * 1.15,
  discount = 0,
  images,
  bestSeller,
  newArrival,
}: ProductCardProps) {
  const image =
    images?.[0]?.imageUrl ||
    "/images/hero-ring.jpg";
  const discountPct =
    discount > 0
      ? Math.round(discount)
      : mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  const addItem = useCartStore((state) => state.addItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const [mounted, setMounted] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? isInWishlist : false;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      slug,
      price: sellingPrice,
      originalPrice: mrp,
      image,
      quantity: 1,
    });
    setAdded(true);
    toast.success(`${name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const addedToWishlist = toggleWishlist({
      id,
      name,
      slug,
      price: sellingPrice,
      originalPrice: mrp,
      image,
    });
    toast(addedToWishlist ? "Saved to Wishlist ✨" : "Removed from Wishlist", {
      icon: addedToWishlist ? "💛" : "🤍",
    });
  };

  return (
    <TiltCard className="product-card group cursor-pointer" maxTilt={6} scale={1.02}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {newArrival && (
          <span className="bg-gold text-dark text-[10px] tracking-widest uppercase px-2.5 py-1 font-semibold">
            New
          </span>
        )}
        {bestSeller && !newArrival && (
          <span className="bg-white/10 backdrop-blur-md text-gold border border-gold/30 text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium">
            Bestseller
          </span>
        )}
        {discountPct > 0 && (
          <span className="bg-red-600/90 text-white text-[10px] tracking-widest uppercase px-2 py-0.5 font-medium">
            {discountPct}% OFF
          </span>
        )}
      </div>

      {/* Image Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-dark-100">
        <Link href={`/products/${slug}`} className="absolute inset-0 block z-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        </Link>

        {/* Quick actions (isolated from Link) */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxury z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex-1 ${
              added ? "bg-emerald-600 text-white" : "bg-gold text-dark hover:bg-gold-light"
            } text-xs tracking-widest uppercase py-3 transition-colors flex items-center justify-center gap-1.5 font-semibold shadow-lg`}
          >
            {added ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={13} /> Add to Cart
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className={`backdrop-blur-md p-3 hover:bg-gold hover:text-dark transition-all duration-300 border border-white/10 ${
              isWishlisted ? "text-gold bg-gold/20 border-gold/30" : "bg-white/10 text-white"
            }`}
          >
            <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Info Area */}
      <Link href={`/products/${slug}`} className="block p-4 border-t border-gold/10 bg-dark-50">
        <h3 className="font-sans text-sm text-white/90 line-clamp-1 mb-2 group-hover:text-gold transition-colors duration-300 font-medium">
          {name}
        </h3>
        <div className="flex items-baseline gap-2.5">
          <span className="font-serif text-lg font-semibold text-white">
            {PricingService.formatPrice(sellingPrice)}
          </span>
          {mrp > sellingPrice && (
            <span className="text-xs text-white/30 line-through">
              {PricingService.formatPrice(mrp)}
            </span>
          )}
        </div>
      </Link>
    </TiltCard>
  );
}
