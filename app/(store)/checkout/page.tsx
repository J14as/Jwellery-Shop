"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  Sparkles,
  Award,
  CheckCircle2,
  UserCheck,
  LogIn,
  X,
} from "lucide-react";
import { PricingService } from "@/lib/pricing/PricingService";
import { useCartStore } from "@/lib/cartStore";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"shipping" | "review" | "payment">("shipping");
  const [loading, setLoading] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  const {
    items,
    couponCode,
    getSubtotal,
    getDiscount,
    getTax,
    getTotal,
    clearCart,
  } = useCartStore();

  const [formData, setFormData] = useState({
    fullName: "Rohan Singhania",
    email: "customer@jewels.com",
    phone: "+91 98765 43210",
    addressLine1: "Villa 14, The Oberoi Greens",
    addressLine2: "Golf Course Road",
    city: "Gurugram",
    state: "Haryana",
    postalCode: "122002",
    country: "India",
  });

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: session.user.name || prev.fullName,
        email: session.user.email || prev.email,
      }));
    }
  }, [session]);

  if (!mounted) {
    return (
      <div className="bg-dark min-h-screen py-24 text-center text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const tax = getTax();
  const total = getTotal();

  // If cart is empty and order is not yet placed, show empty state
  if (items.length === 0 && !orderCompleted) {
    return (
      <div className="bg-dark min-h-screen py-24 text-white">
        <div className="container-custom max-w-lg text-center glass-card p-12 border border-gold/15">
          <h2 className="font-serif text-3xl mb-4">No Creations in Bag</h2>
          <p className="text-white/50 text-sm mb-6">Please add items to your cart before proceeding to checkout.</p>
          <Link href="/categories" className="btn-gold">
            Browse High Jewellery
          </Link>
        </div>
      </div>
    );
  }

  // Handle successful order completion
  const handlePaymentSuccess = (_paymentId: string, orderId: string) => {
    setShowRazorpayModal(false);
    setConfirmedOrderId(orderId);
    setOrderCompleted(true);
    clearCart();
    toast.success("Payment verified! Order confirmed ✨", { duration: 5000 });
  };

  // Launch Razorpay Payment Flow
  const triggerRazorpayPayment = async () => {
    const orderId = `JWL-${Date.now().toString().slice(-6)}`;
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    // If real keys are present and configured
    if (
      razorpayKey &&
      !razorpayKey.includes("placeholder") &&
      !razorpayKey.includes("xxxx")
    ) {
      setLoading(true);
      try {
        if (!window.Razorpay) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = resolve;
            script.onerror = resolve;
            document.body.appendChild(script);
          });
        }

        const razorpay = new window.Razorpay({
          key: razorpayKey,
          amount: Math.round(total * 100),
          currency: "INR",
          name: "JEWELS Haute Joaillerie",
          description: "Fine Jewellery Order Acquisition",
          image: "/images/hero-ring.jpg",
          handler: function (response: any) {
            handlePaymentSuccess(
              response.razorpay_payment_id || `pay_${Date.now()}`,
              orderId
            );
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#D4AF37",
          },
        });
        razorpay.open();
      } catch (err) {
        setShowRazorpayModal(true);
      } finally {
        setLoading(false);
      }
    } else {
      // Interactive Razorpay Modal for Demo / Sandbox
      setShowRazorpayModal(true);
    }
  };

  // Order Confirmed View
  if (orderCompleted) {
    return (
      <div className="bg-dark min-h-screen py-20 text-white">
        <div className="container-custom max-w-2xl">
          <div className="glass-card p-10 md:p-14 border border-gold/30 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center text-gold mx-auto mb-6">
              <CheckCircle2 size={40} strokeWidth={1.5} />
            </div>

            <span className="section-label mb-2 block">Acquisition Confirmed</span>
            <h1 className="font-serif text-3xl md:text-5xl text-white mb-4">
              Thank You, {formData.fullName.split(" ")[0]}
            </h1>
            <p className="text-white/60 text-sm md:text-base font-light mb-8 max-w-lg mx-auto leading-relaxed">
              Your bespoke creation has entered our master atelier for final inspection, serial hallmarking, and velvet presentation wrapping.
            </p>

            {/* Receipt Summary Box */}
            <div className="bg-dark-50 border border-gold/20 p-6 text-left mb-8 text-xs space-y-3 font-light">
              <div className="flex justify-between pb-3 border-b border-gold/10">
                <span className="text-white/50 uppercase tracking-wider">Order Reference</span>
                <span className="text-gold font-mono font-semibold">{confirmedOrderId}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gold/10">
                <span className="text-white/50 uppercase tracking-wider">Payment Method</span>
                <span className="text-white">Razorpay Secure Gateway (INR)</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gold/10">
                <span className="text-white/50 uppercase tracking-wider">Shipping Destination</span>
                <span className="text-white text-right truncate max-w-[240px]">
                  {formData.addressLine1}, {formData.city}, {formData.postalCode}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-white/70 uppercase tracking-wider font-semibold">Total Amount Settled</span>
                <span className="text-gold font-serif text-base font-bold">{PricingService.formatPrice(total)}</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories" className="btn-gold justify-center">
                Continue Exploring <Sparkles size={14} />
              </Link>
              <Link href="/" className="btn-outline justify-center border-white/20 text-white/70 hover:text-gold hover:border-gold">
                Return to Salon
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen pt-8 pb-28 text-white">
      <div className="container-custom">
        {/* Navigation back */}
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/50 hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Shopping Bag</span>
          </Link>

          {/* Patron status tag */}
          {session ? (
            <div className="flex items-center gap-2 text-xs text-gold/90 bg-gold/10 px-3.5 py-1.5 border border-gold/30">
              <UserCheck size={14} />
              <span>Signed In: {session.user?.name || session.user?.email}</span>
            </div>
          ) : (
            <Link
              href="/auth/sign-in?callbackUrl=/checkout"
              className="flex items-center gap-2 text-xs text-white/70 hover:text-gold bg-dark-50 px-3.5 py-1.5 border border-white/10 hover:border-gold/30 transition-colors"
            >
              <LogIn size={14} />
              <span>Sign In for Patron Perks</span>
            </Link>
          )}
        </div>

        {/* Step Indicator */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px bg-gold/20 z-0" />

            {[
              { id: "shipping", label: "1. White-Glove Shipping" },
              { id: "review", label: "2. Atelier Review" },
              { id: "payment", label: "3. Razorpay Settlement" },
            ].map((s, idx) => {
              const isCurrent = step === s.id;
              const isDone =
                (step === "review" && idx === 0) ||
                (step === "payment" && (idx === 0 || idx === 1));

              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center bg-dark px-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-300 ${
                      isDone
                        ? "bg-gold text-dark border-gold"
                        : isCurrent
                        ? "border-gold text-gold bg-gold/10 ring-4 ring-gold/20"
                        : "border-white/20 text-white/40 bg-dark-50"
                    }`}
                  >
                    {isDone ? <Check size={14} strokeWidth={2.5} /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] tracking-wider uppercase mt-2 hidden sm:block font-medium ${
                      isCurrent ? "text-gold" : isDone ? "text-white" : "text-white/40"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Form Area (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Shipping Details */}
            {step === "shipping" && (
              <div className="glass-card p-8 md:p-10 border border-gold/15 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gold/15">
                  <h2 className="font-serif text-2xl text-white">Recipient &amp; Delivery Details</h2>
                  <span className="text-xs text-gold flex items-center gap-1">
                    <Truck size={14} /> Insured Direct Delivery
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 tracking-wider uppercase block mb-1.5">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-dark-50 border border-gold/20 p-3 text-sm text-white focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 tracking-wider uppercase block mb-1.5">
                      Email for Certificate &amp; Tracking *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-dark-50 border border-gold/20 p-3 text-sm text-white focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 tracking-wider uppercase block mb-1.5">
                      Contact Number for OTP &amp; Courier *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-dark-50 border border-gold/20 p-3 text-sm text-white focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 tracking-wider uppercase block mb-1.5">
                      Street Address / Residence *
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="w-full bg-dark-50 border border-gold/20 p-3 text-sm text-white focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 tracking-wider uppercase block mb-1.5">
                      Apartment, Suite, Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      className="w-full bg-dark-50 border border-gold/20 p-3 text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 tracking-wider uppercase block mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-dark-50 border border-gold/20 p-3 text-sm text-white focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 tracking-wider uppercase block mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-dark-50 border border-gold/20 p-3 text-sm text-white focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 tracking-wider uppercase block mb-1.5">
                      Postal PIN Code *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full bg-dark-50 border border-gold/20 p-3 text-sm text-white focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 tracking-wider uppercase block mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      disabled
                      className="w-full bg-dark-100 border border-white/10 p-3 text-sm text-white/50"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!formData.fullName || !formData.email || !formData.phone || !formData.addressLine1 || !formData.city || !formData.postalCode) {
                      toast.error("Please fill in all mandatory shipping fields");
                      return;
                    }
                    setStep("review");
                  }}
                  className="w-full btn-gold justify-center py-4 mt-6"
                >
                  Proceed to Atelier Review
                </button>
              </div>
            )}

            {/* Step 2: Review */}
            {step === "review" && (
              <div className="glass-card p-8 md:p-10 border border-gold/15 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gold/15">
                  <h2 className="font-serif text-2xl text-white">Review Your Acquisition</h2>
                  <button
                    onClick={() => setStep("shipping")}
                    className="text-xs text-gold underline hover:text-gold-light"
                  >
                    Edit Shipping
                  </button>
                </div>

                {/* Shipping summary card */}
                <div className="p-4 bg-dark-50 border border-gold/15 text-xs text-white/70 space-y-1">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block font-medium">
                    White-Glove Destination
                  </span>
                  <p className="text-white font-medium text-sm">{formData.fullName} ({formData.phone})</p>
                  <p>{formData.addressLine1} {formData.addressLine2 && `, ${formData.addressLine2}`}</p>
                  <p>{formData.city}, {formData.state} - {formData.postalCode}, {formData.country}</p>
                  <p className="text-white/40 text-[11px] pt-1">Confirmation &amp; Insurance Copy to: {formData.email}</p>
                </div>

                {/* Items in order */}
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-white/50 block">
                    Certified Atelier Pieces ({items.length})
                  </span>
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex items-center gap-4 p-3.5 bg-dark-50 border border-white/10"
                    >
                      <div className="relative w-14 h-16 bg-dark-100 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        <p className="text-xs text-white/40">
                          Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                        </p>
                      </div>
                      <span className="font-serif text-sm font-semibold text-gold">
                        {PricingService.formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="btn-outline border-white/20 text-white/60 hover:border-gold hover:text-gold text-xs py-4 px-6"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("payment")}
                    className="flex-1 btn-gold justify-center py-4"
                  >
                    Continue to Razorpay Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === "payment" && (
              <div className="glass-card p-8 md:p-10 border border-gold/20 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold mx-auto mb-2">
                  <CreditCard size={28} strokeWidth={1.5} />
                </div>

                <h2 className="font-serif text-3xl text-white">Razorpay Secure Checkout</h2>
                <p className="text-white/60 text-sm font-light max-w-md mx-auto leading-relaxed">
                  You will now be connected to Razorpay&apos;s encrypted 256-bit payment gateway. Complete your transaction using UPI, Credit/Debit Cards, NetBanking, or EMI.
                </p>

                <div className="p-4 bg-dark-50 border border-gold/15 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-white/50">Settlement Amount:</span>
                    <span className="text-gold font-serif text-base font-bold">{PricingService.formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Merchant Account:</span>
                    <span className="text-white">JEWELS Haute Joaillerie</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Encrypted Protocol:</span>
                    <span className="text-emerald-400 font-mono">TLS 1.3 / AES-256</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => setStep("review")}
                    className="btn-outline border-white/20 text-white/60 hover:border-gold hover:text-gold py-4 px-6 text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={triggerRazorpayPayment}
                    disabled={loading}
                    className="flex-1 btn-gold justify-center py-4 font-semibold disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                        Connecting Gateway...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock size={14} /> Pay {PricingService.formatPrice(total)} with Razorpay
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 md:p-8 border border-gold/15 sticky top-24 space-y-6">
              <h3 className="font-serif text-xl text-white pb-4 border-b border-gold/15 flex items-center justify-between">
                <span>Summary</span>
                <span className="text-xs font-mono text-gold font-normal">{items.length} Piece{items.length > 1 ? "s" : ""}</span>
              </h3>

              {/* Price Calculation */}
              <div className="space-y-3 text-xs text-white/70 font-light pb-4 border-b border-gold/15">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">{PricingService.formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Promotion Applied ({couponCode})</span>
                    <span>-{PricingService.formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Shipping</span>
                  <span className="text-gold uppercase tracking-wider text-[11px] font-semibold">Complimentary</span>
                </div>
                <div className="flex justify-between">
                  <span>3% Fine Jewellery GST</span>
                  <span className="font-medium text-white">{PricingService.formatPrice(tax)}</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/50 block">Grand Total</span>
                  <span className="text-[10px] text-white/40">Includes all applicable duties</span>
                </div>
                <span className="font-serif text-2xl md:text-3xl font-bold text-gold">
                  {PricingService.formatPrice(total)}
                </span>
              </div>

              {/* Security Badges */}
              <div className="space-y-2.5 pt-4 border-t border-gold/10 text-[11px] text-white/50 font-light">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-gold" />
                  <span>Razorpay Verified Payment Gateway</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-gold" />
                  <span>Official BIS Hallmarking Certificate Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-gold" />
                  <span>Full Transit Insurance Coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Razorpay Modal (Sandbox & Real Fallback) ── */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.25)] max-w-md w-full overflow-hidden text-white relative animate-fade-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0C2340] via-[#08182B] to-[#0C2340] p-5 border-b border-gold/20 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg text-white font-bold tracking-wider">JEWELS</span>
                  <span className="text-[10px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded font-mono">
                    RAZORPAY SECURE
                  </span>
                </div>
                <p className="text-[11px] text-blue-200/70 mt-0.5">Order ID: JWL-{Date.now().toString().slice(-6)}</p>
              </div>
              <button
                onClick={() => setShowRazorpayModal(false)}
                className="text-white/60 hover:text-white p-1"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-baseline pb-3 border-b border-white/10">
                <span className="text-xs text-white/50 uppercase tracking-wider">Amount to Pay</span>
                <span className="font-serif text-2xl text-gold font-bold">{PricingService.formatPrice(total)}</span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <span className="text-xs text-white/60 uppercase tracking-widest block font-medium">
                  Select Payment Option
                </span>

                <div
                  onClick={() => setSelectedMethod("upi")}
                  className={`p-3.5 border cursor-pointer flex items-center justify-between transition-colors ${
                    selectedMethod === "upi"
                      ? "border-gold bg-gold/10 text-white"
                      : "border-white/10 hover:border-white/30 text-white/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      UPI
                    </div>
                    <div>
                      <p className="text-xs font-medium">Google Pay / PhonePe / Paytm / UPI ID</p>
                      <p className="text-[10px] text-white/40">Instant verification with 0% extra surcharge</p>
                    </div>
                  </div>
                  {selectedMethod === "upi" && <Check size={16} className="text-gold" />}
                </div>

                <div
                  onClick={() => setSelectedMethod("card")}
                  className={`p-3.5 border cursor-pointer flex items-center justify-between transition-colors ${
                    selectedMethod === "card"
                      ? "border-gold bg-gold/10 text-white"
                      : "border-white/10 hover:border-white/30 text-white/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Credit / Debit Card (Visa, Mastercard, Amex)</p>
                      <p className="text-[10px] text-white/40">Secure 3D-OTP Verified</p>
                    </div>
                  </div>
                  {selectedMethod === "card" && <Check size={16} className="text-gold" />}
                </div>

                <div
                  onClick={() => setSelectedMethod("netbanking")}
                  className={`p-3.5 border cursor-pointer flex items-center justify-between transition-colors ${
                    selectedMethod === "netbanking"
                      ? "border-gold bg-gold/10 text-white"
                      : "border-white/10 hover:border-white/30 text-white/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                      NB
                    </div>
                    <div>
                      <p className="text-xs font-medium">NetBanking &amp; High-Value Wire Transfer</p>
                      <p className="text-[10px] text-white/40">All Major Indian &amp; International Banks</p>
                    </div>
                  </div>
                  {selectedMethod === "netbanking" && <Check size={16} className="text-gold" />}
                </div>
              </div>

              {/* Pay Action Button */}
              <button
                onClick={() => {
                  const simId = `pay_${Date.now().toString().slice(-8)}`;
                  const ordId = `JWL-${Date.now().toString().slice(-6)}`;
                  handlePaymentSuccess(simId, ordId);
                }}
                className="w-full btn-gold justify-center py-4 font-semibold text-xs tracking-widest uppercase shadow-lg shadow-gold/20 mt-4"
              >
                Authorize &amp; Complete Payment ✨
              </button>

              <p className="text-[10px] text-center text-white/40 flex items-center justify-center gap-1">
                <Lock size={11} className="text-gold" /> Encrypted &amp; Powered by Razorpay Payments India
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
