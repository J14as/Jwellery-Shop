"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { PricingService } from "@/lib/pricing/PricingService";
import { useCartStore } from "@/lib/cartStore";
import toast from "react-hot-toast";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const {
    items,
    couponCode,
    couponDiscount,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    getTotal,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-dark min-h-screen py-24 text-center text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      toast.success(`Coupon ${couponInput.toUpperCase()} applied successfully! ✨`);
      setCouponInput("");
    } else {
      toast.error("Invalid coupon code. Try WELCOME10 or ROYAL20");
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-dark min-h-screen py-28 text-white">
        <div className="container-custom max-w-xl text-center glass-card p-12 md:p-16 border border-gold/15">
          <div className="w-16 h-16 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold mx-auto mb-6">
            <ShoppingBag size={28} strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl mb-4">Your Jewellery Bag is Empty</h1>
          <p className="text-white/50 text-sm font-light mb-8 leading-relaxed">
            Your shopping bag awaits your timeless selections. Explore our handcrafted creations and find your signature piece.
          </p>
          <Link href="/categories" className="btn-gold">
            Discover Collections <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  return (
    <div className="bg-dark min-h-screen pt-12 pb-28 text-white">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="section-label mb-2 block">Haute Joaillerie</span>
            <h1 className="font-serif text-4xl md:text-5xl text-white">Your Shopping Bag</h1>
          </div>
          <span className="text-xs tracking-widest uppercase text-gold">
            {items.reduce((sum, item) => sum + item.quantity, 0)} Items Selected
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size || "default"}`}
                className="glass-card p-4 sm:p-6 border border-gold/15 flex flex-row items-start sm:items-center gap-4 sm:gap-6 group hover:border-gold/35 transition-colors duration-300"
              >
                {/* Image */}
                <div className="relative w-20 h-24 sm:w-28 sm:h-32 flex-shrink-0 bg-dark-100 border border-gold/10 overflow-hidden rounded-none">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-serif text-base sm:text-xl text-white hover:text-gold transition-colors block truncate"
                    >
                      {item.name}
                    </Link>
                    <span className="font-serif text-base sm:text-xl font-semibold text-white sm:text-right block">
                      {PricingService.formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-white/50 mb-3 sm:mb-4">
                    {item.metal && <span>{item.metal}</span>}
                    {item.size && <span>• Size: {item.size}</span>}
                    <span className="text-gold hidden xs:inline">• Certified</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4 sm:gap-6 pt-1">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gold/20 bg-dark-50 text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, -1, item.size)}
                        aria-label="Decrease quantity"
                        className="px-2.5 sm:px-3 py-1.5 text-white/70 hover:text-gold transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2.5 sm:px-3 font-semibold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1, item.size)}
                        aria-label="Increase quantity"
                        className="px-2.5 sm:px-3 py-1.5 text-white/70 hover:text-gold transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => {
                        removeItem(item.id, item.size);
                        toast.success(`${item.name} removed from bag`);
                      }}
                      className="text-xs text-white/40 hover:text-red-400 flex items-center gap-1 transition-colors py-1"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust Banner under items */}
            <div className="p-4 border border-gold/15 bg-gold/5 flex flex-wrap items-center justify-between gap-4 text-xs text-white/70">
              <span className="flex items-center gap-2 text-gold">
                <Sparkles size={14} /> Complimentary Insured Express Shipping on all orders
              </span>
              <span className="flex items-center gap-1.5 text-white/50">
                <ShieldCheck size={14} className="text-gold" /> Laser-Inscribed BIS Hallmark Guarantee
              </span>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="glass-card p-6 md:p-8 border border-gold/15 sticky top-24">
              <h2 className="font-serif text-2xl text-white mb-6 pb-4 border-b border-gold/15">
                Order Summary
              </h2>

              {/* Breakdown */}
              <div className="space-y-3.5 text-sm mb-6 pb-6 border-b border-gold/15 font-light">
                <div className="flex justify-between text-white/70">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-white">{PricingService.formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span className="flex items-center gap-1">
                      <Tag size={13} /> Promotion ({couponCode})
                    </span>
                    <span className="font-semibold">-{PricingService.formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-white/70">
                  <span>Insured Shipping</span>
                  <span>{shipping === 0 ? <span className="text-gold uppercase tracking-wider text-xs font-semibold">Complimentary</span> : PricingService.formatPrice(shipping)}</span>
                </div>

                <div className="flex justify-between text-white/70">
                  <span>GST (3% Fine Jewellery)</span>
                  <span className="font-medium text-white">{PricingService.formatPrice(tax)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline mb-8">
                <div>
                  <span className="font-serif text-xl text-white font-medium block">Total Payable</span>
                  <span className="text-[10px] text-white/40 tracking-wider uppercase">Including All Taxes</span>
                </div>
                <span className="font-serif text-3xl font-bold text-gold">
                  {PricingService.formatPrice(total)}
                </span>
              </div>

              {/* Coupon Form */}
              <div className="mb-8">
                {couponCode ? (
                  <div className="p-3 bg-gold/10 border border-gold/30 flex items-center justify-between text-xs">
                    <span className="text-gold font-medium">Applied: {couponCode} ({couponDiscount * 100}% off)</span>
                    <button
                      onClick={removeCoupon}
                      className="text-white/50 hover:text-red-400 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label className="text-[11px] uppercase tracking-widest text-white/50 block">
                      Promotional Code
                    </label>
                    <div className="flex border border-gold/20 bg-dark-50 focus-within:border-gold transition-colors">
                      <input
                        type="text"
                        placeholder="e.g. WELCOME10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-2.5 bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none uppercase"
                      />
                      <button
                        type="submit"
                        className="px-4 bg-gold/15 text-gold text-xs font-semibold hover:bg-gold hover:text-dark transition-colors tracking-wider uppercase"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-[10px] text-white/40">Try code <span className="text-gold">WELCOME10</span> for 10% off your creation</p>
                  </form>
                )}
              </div>

              {/* Proceed Button */}
              <Link
                href="/checkout"
                className="w-full btn-gold justify-center py-4 mb-3"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </Link>

              <Link
                href="/categories"
                className="w-full btn-outline justify-center py-3 text-xs border-white/20 text-white/60 hover:text-gold hover:border-gold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
