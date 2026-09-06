"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !footerRef.current) return;

    // Staggered column reveal
    const columns = footerRef.current.querySelectorAll(".footer-col");
    gsap.fromTo(
      columns,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === footerRef.current) t.kill();
      });
    };
  }, [prefersReducedMotion]);

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-gold/10"
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #060606 100%)",
      }}
    >
      {/* Gold line animation at top */}
      <div className="gold-line-animated" />

      {/* Main footer */}
      <div className="container-custom py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="footer-col">
          <div className="mb-6">
            <span className="font-serif text-2xl tracking-wider text-white">JEWELS</span>
            <p className="text-[9px] tracking-[0.35em] text-gold/60 uppercase mt-1">Luxury Jewellery</p>
          </div>
          <p className="text-white/30 text-sm leading-relaxed mb-8">
            Crafting timeless jewellery since 2010. Every piece tells a story of love, legacy and craftsmanship.
          </p>
          <div className="flex gap-3">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Youtube, label: "YouTube" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40
                           hover:border-gold hover:text-gold hover:bg-gold/5 hover:scale-110
                           transition-all duration-300"
              >
                <Icon size={15} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div className="footer-col">
          <h4 className="text-xs tracking-[0.2em] uppercase text-gold/70 mb-6 font-medium">Shop</h4>
          <ul className="space-y-3">
            {[
              { label: "Rings",     href: "/categories/rings" },
              { label: "Earrings",  href: "/categories/earrings" },
              { label: "Necklaces", href: "/categories/necklaces" },
              { label: "Bracelets", href: "/categories/bracelets" },
              { label: "Bangles",   href: "/categories/bangles" },
              { label: "Pendants",  href: "/categories/pendants" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/30 hover:text-gold transition-colors duration-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div className="footer-col">
          <h4 className="text-xs tracking-[0.2em] uppercase text-gold/70 mb-6 font-medium">Help</h4>
          <ul className="space-y-3">
            {[
              { label: "Contact Us",         href: "/contact" },
              { label: "Shipping & Returns", href: "/shipping" },
              { label: "Size Guide",         href: "/size-guide" },
              { label: "Jewellery Care",     href: "/care" },
              { label: "FAQs",               href: "/faq" },
              { label: "Track Order",        href: "/account/orders" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/30 hover:text-gold transition-colors duration-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4 className="text-xs tracking-[0.2em] uppercase text-gold/70 mb-6 font-medium">Contact</h4>
          <ul className="space-y-4">
            <li>
              <a href="mailto:contact@jewels.com" className="flex items-start gap-3 text-sm text-white/30 hover:text-gold transition-colors duration-300 group">
                <Mail size={15} className="mt-0.5 shrink-0" strokeWidth={1.5} />
                contact@jewels.com
              </a>
            </li>
            <li>
              <a href="tel:+919876543210" className="flex items-start gap-3 text-sm text-white/30 hover:text-gold transition-colors duration-300 group">
                <Phone size={15} className="mt-0.5 shrink-0" strokeWidth={1.5} />
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-start gap-3 text-sm text-white/30">
              <MapPin size={15} className="mt-0.5 shrink-0" strokeWidth={1.5} />
              123 Luxury Lane, Connaught Place,<br />New Delhi — 110001
            </li>
          </ul>

          <div className="mt-8 p-4 border border-gold/10 bg-white/[0.02]">
            <p className="text-xs text-white/30 mb-1">Mon – Sat &nbsp; 10am – 7pm</p>
            <p className="text-xs text-white/30">Sun &nbsp; 11am – 5pm</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} Jewels Luxury. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms", "Cancellation"].map((l) => (
              <Link key={l} href="#" className="text-xs text-white/20 hover:text-gold/60 transition-colors duration-300">
                {l}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/20">
            <span>We accept:</span>
            {["UPI", "CARD", "COD"].map((method) => (
              <span key={method} className="border border-white/10 px-2 py-0.5 text-[10px] tracking-wider">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
