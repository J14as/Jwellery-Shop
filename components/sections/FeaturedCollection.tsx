"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Heart, ShoppingCart, Check } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import toast from "react-hot-toast";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PRODUCTS = [
  {
    id: "1",
    name: "Eternal Solitaire Ring",
    price: "₹1,25,000",
    numericPrice: 125000,
    originalPrice: "₹1,45,000",
    numericOriginalPrice: 145000,
    image: "/images/hero-ring.jpg",
    slug: "eternal-solitaire-ring",
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Royal Filigree Necklace",
    price: "₹2,85,000",
    numericPrice: 285000,
    originalPrice: "₹3,20,000",
    numericOriginalPrice: 320000,
    image: "/images/products/necklace.jpg",
    slug: "royal-filigree-necklace",
    badge: "New",
  },
  {
    id: "3",
    name: "Cascade Diamond Earrings",
    price: "₹98,000",
    numericPrice: 98000,
    originalPrice: "₹1,15,000",
    numericOriginalPrice: 115000,
    image: "/images/products/earrings.jpg",
    slug: "cascade-diamond-earrings",
    badge: null,
  },
  {
    id: "4",
    name: "Heritage Gold Bangle",
    price: "₹1,65,000",
    numericPrice: 165000,
    originalPrice: "₹1,90,000",
    numericOriginalPrice: 190000,
    image: "/images/products/bracelet.jpg",
    slug: "heritage-gold-bangle",
    badge: "New",
  },
  {
    id: "5",
    name: "Trinity Stacking Rings",
    price: "₹78,000",
    numericPrice: 78000,
    originalPrice: "₹92,000",
    numericOriginalPrice: 92000,
    image: "/images/products/ring-set.jpg",
    slug: "trinity-stacking-rings",
    badge: null,
  },
  {
    id: "6",
    name: "Celestial Drop Necklace",
    price: "₹1,48,000",
    numericPrice: 148000,
    originalPrice: "₹1,72,000",
    numericOriginalPrice: 172000,
    image: "/images/products/necklace.jpg",
    slug: "celestial-drop-necklace",
    badge: "Bestseller",
  },
];

function ProductCardLuxury({
  product,
}: {
  product: (typeof PRODUCTS)[0];
}) {
  const addItem = useCartStore((state) => state.addItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
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
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.numericPrice,
      originalPrice: product.numericOriginalPrice,
      image: product.image,
      quantity: 1,
    });
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const addedToWishlist = toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.numericPrice,
      originalPrice: product.numericOriginalPrice,
      image: product.image,
    });
    toast(addedToWishlist ? "Saved to Wishlist ✨" : "Removed from Wishlist", {
      icon: addedToWishlist ? "💛" : "🤍",
    });
  };

  return (
    <TiltCard className="product-card group cursor-pointer" maxTilt={6} scale={1.02}>
      {/* Badge */}
      {product.badge && (
        <span className={`absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 text-[9px] sm:text-[10px] tracking-widest uppercase px-2 py-0.5 sm:px-3 sm:py-1 font-medium ${
          product.badge === "New" ? "bg-gold text-dark" : "bg-white/10 backdrop-blur-md text-gold border border-gold/30"
        }`}>
          {product.badge}
        </span>
      )}

      {/* Mobile Wishlist Button */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        aria-label="Wishlist"
        className={`md:hidden absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 ${
          isWishlisted
            ? "bg-gold text-dark border-gold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
            : "bg-black/40 text-white/80 border-white/20 active:bg-gold/30"
        }`}
      >
        <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 block z-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110 group-active:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Touch light sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 pointer-events-none" />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        </Link>

        {/* Quick actions (Desktop hover reveal) */}
        <div className="hidden md:flex absolute bottom-0 left-0 right-0 p-4 gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxury z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex-1 ${
              added ? "bg-emerald-600 text-white" : "bg-gold text-dark hover:bg-gold-light"
            } text-xs tracking-widest uppercase py-3 transition-colors flex items-center justify-center gap-1.5 font-medium shadow-lg active:scale-95`}
          >
            {added ? (
              <>
                <Check size={13} /> Added
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
            className={`backdrop-blur-sm p-3 hover:bg-gold hover:text-dark transition-all duration-300 border border-white/10 active:scale-90 ${
              isWishlisted ? "bg-gold/20 text-gold border-gold/30" : "bg-white/10 text-white"
            }`}
          >
            <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 border-t border-gold/10 flex flex-col justify-between">
        <Link href={`/products/${product.slug}`} className="block mb-1.5">
          <h3 className="font-sans text-xs sm:text-sm text-white/80 line-clamp-1 group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-serif text-base sm:text-lg font-semibold text-white">
              {product.price}
            </span>
            <span className="text-[11px] sm:text-xs text-white/30 line-through">
              {product.originalPrice}
            </span>
          </div>
        </Link>

        {/* Mobile quick add button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className={`md:hidden mt-2 w-full py-2 text-[10px] tracking-widest uppercase font-semibold flex items-center justify-center gap-1 transition-all active:scale-95 ${
            added
              ? "bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              : "bg-gold/15 text-gold border border-gold/30 active:bg-gold active:text-dark"
          }`}
        >
          {added ? (
            <>
              <Check size={12} /> Added
            </>
          ) : (
            <>
              <ShoppingCart size={11} /> Quick Add
            </>
          )}
        </button>
      </div>
    </TiltCard>
  );
}

export function FeaturedCollection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    // Section fold-in from top
    const foldTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 90%",
        end: "top 40%",
        scrub: 0.8,
      },
    });

    foldTl.fromTo(
      sectionRef.current,
      {
        rotateX: -8,
        opacity: 0.3,
        transformOrigin: "top center",
      },
      {
        rotateX: 0,
        opacity: 1,
        ease: "power2.out",
      }
    );

    // Heading reveal
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Cards staggered entry
    if (gridRef.current) {
      const cards = gridRef.current.children;
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === sectionRef.current || t.trigger === headingRef.current || t.trigger === gridRef.current) {
          t.kill();
        }
      });
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="featured"
      className="py-24 md:py-32 relative"
      style={{
        perspective: "1200px",
        background: "linear-gradient(180deg, #0A0A0A 0%, #0E0E0E 50%, #0A0A0A 100%)",
      }}
    >
      {/* Subtle gold radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="container-custom relative z-10">
        {/* Heading */}
        <div ref={headingRef} className="flex items-end justify-between mb-16">
          <div>
            <p className="section-label mb-3">Handpicked for You</p>
            <h2 className="section-heading">Featured Pieces</h2>
          </div>
          <Link
            href="/categories/rings"
            className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase text-gold/70 hover:text-gold transition-colors duration-300 font-medium group"
          >
            View All
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Product Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {PRODUCTS.map((product) => (
            <ProductCardLuxury key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
