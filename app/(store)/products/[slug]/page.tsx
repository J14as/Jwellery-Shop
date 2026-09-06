"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Star,
  ShoppingBag,
} from "lucide-react";
import { PricingService } from "@/lib/pricing/PricingService";
import { MOCK_PRODUCTS, ProductItem } from "@/lib/mockProducts";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { ProductCard } from "@/components/ProductCard";
import toast from "react-hot-toast";

interface Props {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: Props) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);

  // Find product in mocks or fallback to first
  const product: ProductItem =
    MOCK_PRODUCTS.find((p) => p.slug === params.slug) || MOCK_PRODUCTS[0];

  const [mounted, setMounted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("12");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? isInWishlist(product.id) : false;

  const images = product.images.length > 0 ? product.images : [{ imageUrl: "/images/hero-ring.jpg" }];
  const currentImage = images[selectedImageIndex]?.imageUrl || images[0].imageUrl;

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.sellingPrice,
      originalPrice: product.mrp,
      image: currentImage,
      quantity,
      size: selectedSize,
      metal: product.metalType,
    });

    toast.success(`${product.name} (Size ${selectedSize}) added to your cart ✨`);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Creation link copied to clipboard 🔗");
    }
  };

  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="bg-dark text-white min-h-screen pt-8 pb-28">
      {/* Breadcrumb */}
      <div className="container-custom mb-8">
        <nav className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/40">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/categories/${product.category}`} className="hover:text-gold transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gold font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main Showcase */}
      <div className="container-custom mb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3.5 overflow-x-auto md:overflow-visible">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 md:w-24 md:h-28 flex-shrink-0 border transition-all duration-300 overflow-hidden ${
                    selectedImageIndex === idx
                      ? "border-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-[1.02]"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-[3/4] overflow-hidden border border-gold/15 bg-dark-100 group">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {product.newArrival && (
                  <span className="bg-gold text-dark text-[10px] tracking-widest uppercase px-3 py-1 font-semibold">
                    New
                  </span>
                )}
                {product.bestSeller && (
                  <span className="bg-white/10 backdrop-blur-md text-gold border border-gold/30 text-[10px] tracking-widest uppercase px-3 py-1 font-medium">
                    Iconic Piece
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Header & Title */}
              <div className="mb-4 flex items-center justify-between">
                <span className="section-label">Haute Joaillerie</span>
                <div className="flex items-center gap-1 text-gold text-xs">
                  <Star size={13} fill="currentColor" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-white/40">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl text-white mb-4 leading-tight">
                {product.name}
              </h1>

              <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                {product.shortDescription}
              </p>

              {/* Price Row */}
              <div className="py-5 border-y border-gold/15 mb-8">
                <div className="flex items-baseline gap-4 mb-1">
                  <span className="font-serif text-3xl md:text-4xl font-semibold text-white">
                    {PricingService.formatPrice(product.sellingPrice)}
                  </span>
                  {product.mrp > product.sellingPrice && (
                    <>
                      <span className="text-base text-white/40 line-through">
                        {PricingService.formatPrice(product.mrp)}
                      </span>
                      <span className="text-xs tracking-wider uppercase text-gold font-medium bg-gold/10 px-2 py-0.5 border border-gold/20">
                        Save {PricingService.formatPrice(product.mrp - product.sellingPrice)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-white/40 tracking-wider">
                  Inclusive of all taxes &amp; insured white-glove courier delivery.
                </p>
              </div>

              {/* Metal & Purity Badge */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3.5 border border-gold/15 bg-dark-50">
                  <span className="text-white/40 text-[10px] tracking-widest uppercase block mb-1">
                    Metal
                  </span>
                  <span className="text-white text-sm font-medium">
                    {product.metalType}
                  </span>
                </div>
                <div className="p-3.5 border border-gold/15 bg-dark-50">
                  <span className="text-white/40 text-[10px] tracking-widest uppercase block mb-1">
                    Purity
                  </span>
                  <span className="text-gold text-sm font-medium">
                    {product.metalPurity} Hallmarked
                  </span>
                </div>
              </div>

              {/* Ring Size Selector (if applicable) */}
              {product.variants.some((v) => v.ringSize) && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs uppercase tracking-widest text-white/70">
                      Select Ring Size (Indian Standard)
                    </span>
                    <span className="text-[11px] text-gold underline cursor-pointer">
                      Size Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => v.ringSize && setSelectedSize(v.ringSize)}
                        className={`w-12 h-10 text-xs font-medium border transition-all duration-300 ${
                          selectedSize === v.ringSize
                            ? "border-gold bg-gold text-dark font-bold"
                            : "border-white/15 text-white/70 hover:border-gold/50"
                        }`}
                      >
                        {v.ringSize}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs uppercase tracking-widest text-white/70">
                  Quantity:
                </span>
                <div className="flex items-center border border-gold/20 bg-dark-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-white/70 hover:text-gold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-white/70 hover:text-gold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="flex flex-col sm:flex-row gap-3.5 mb-6">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    isAdding
                      ? "bg-emerald-600 text-white"
                      : "bg-gold text-dark hover:bg-gold-light"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check size={16} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 text-xs tracking-widest uppercase font-semibold border border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300"
                >
                  Buy Now Instantly
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const added = toggleWishlist({
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.sellingPrice,
                        originalPrice: product.mrp,
                        image: currentImage,
                        category: product.category,
                        metal: product.metalType,
                      });
                      toast(added ? "Saved to Wishlist ✨" : "Removed from Wishlist", {
                        icon: added ? "💛" : "🤍",
                      });
                    }}
                    aria-label="Wishlist"
                    className={`p-4 border border-white/15 hover:border-gold transition-colors ${
                      isWishlisted ? "text-gold bg-gold/10 border-gold/40" : "text-white/60"
                    }`}
                  >
                    <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={handleShare}
                    aria-label="Share"
                    className="p-4 border border-white/15 text-white/60 hover:border-gold hover:text-white transition-colors"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gold/10 text-xs text-white/60 font-light">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-gold flex-shrink-0" />
                  <span>BIS Hallmarked Purity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-gold flex-shrink-0" />
                  <span>GIA/IGI Certified Gems</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gold flex-shrink-0" />
                  <span>Insured Express Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={16} className="text-gold flex-shrink-0" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Master Narrative */}
      <div className="container-custom mb-24">
        <div className="glass-card p-8 md:p-14 border border-gold/15 max-w-4xl mx-auto">
          <span className="section-label mb-3 block">Atelier Notes</span>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
            The Story Behind the Piece
          </h2>
          <p className="text-white/70 text-base md:text-lg font-light leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-gold/10">
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest block mb-1">
                Authenticity SKU
              </span>
              <span className="text-white font-mono text-sm">{product.sku}</span>
            </div>
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest block mb-1">
                Karat Certification
              </span>
              <span className="text-gold text-sm font-medium">{product.metalPurity}</span>
            </div>
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest block mb-1">
                Origin
              </span>
              <span className="text-white text-sm">JEWELS New Delhi Atelier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Creations */}
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="section-label mb-2 block">Pair With</span>
          <h2 className="section-heading">Complementary Creations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
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
