"use client";

import Image from "next/image";
import { Truck, CheckCircle2, Download, Sparkles } from "lucide-react";
import { PricingService } from "@/lib/pricing/PricingService";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
  metal: string;
  size?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  statusLabel: string;
  items: OrderItem[];
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: "JWL-894201",
    date: "28 August 2025",
    total: 125000,
    status: "DELIVERED",
    statusLabel: "White-Glove Delivered",
    items: [
      {
        name: "Eternal Solitaire Ring",
        image: "/images/hero-ring.jpg",
        price: 125000,
        quantity: 1,
        metal: "18K Yellow Gold",
        size: "12",
      },
    ],
  },
  {
    id: "JWL-782109",
    date: "14 July 2025",
    total: 98000,
    status: "CONFIRMED",
    statusLabel: "In Master Atelier Final Polish",
    items: [
      {
        name: "Cascade Diamond Earrings",
        image: "/images/products/earrings.jpg",
        price: 98000,
        quantity: 1,
        metal: "18K Yellow Gold",
      },
    ],
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6 text-white">
      <div className="glass-card p-6 border border-gold/15 flex justify-between items-center">
        <div>
          <span className="section-label mb-1 block">Acquisition History</span>
          <h2 className="font-serif text-2xl text-white">Your Atelier Orders</h2>
        </div>
        <span className="text-xs text-gold/80 font-mono">2 Registered Orders</span>
      </div>

      <div className="space-y-4">
        {SAMPLE_ORDERS.map((order) => (
          <div
            key={order.id}
            className="glass-card p-6 border border-gold/15 space-y-6 hover:border-gold/30 transition-colors"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gold/10 gap-2">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block font-mono">
                  Reference ID
                </span>
                <span className="text-gold font-mono font-semibold text-sm">
                  {order.id}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                  Date Placed
                </span>
                <span className="text-white text-xs">{order.date}</span>
              </div>

              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                  Settlement Status
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 size={12} /> Verified (Razorpay)
                </span>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] text-white/40 uppercase tracking-widest block">
                  Amount
                </span>
                <span className="font-serif text-lg text-white font-bold">
                  {PricingService.formatPrice(order.total)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="relative w-16 h-20 bg-dark-100 border border-gold/10 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-white/40">
                      {item.metal} {item.size && `• Size: ${item.size}`} • Qty: {item.quantity}
                    </p>
                    <span className="text-gold text-[11px] flex items-center gap-1 mt-1">
                      <Sparkles size={11} /> 100% BIS Hallmarked &amp; Insured
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Tracking */}
            <div className="pt-4 border-t border-gold/10 flex flex-wrap justify-between items-center gap-3 text-xs">
              <div className="flex items-center gap-2 text-white/70">
                <Truck size={14} className="text-gold" />
                <span>Status: <strong className="text-gold font-normal">{order.statusLabel}</strong></span>
              </div>

              <button className="flex items-center gap-1.5 text-white/60 hover:text-gold transition-colors text-[11px] underline">
                <Download size={13} />
                <span>Download Authenticity Certificate &amp; Tax Invoice</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
