"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function NewsletterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    // Perspective tilt on scroll
    gsap.fromTo(
      sectionRef.current,
      { rotateX: 4, opacity: 0.5, transformOrigin: "bottom center" },
      {
        rotateX: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 50%",
          scrub: 0.6,
        },
      }
    );

    // Content stagger
    const elements = sectionRef.current.querySelectorAll(".nl-reveal");
    gsap.fromTo(
      elements,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === sectionRef.current) t.kill();
      });
    };
  }, [prefersReducedMotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const input = (e.target as HTMLFormElement).querySelector("input");
      if (input?.value) {
        input.value = "";
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const toast = require("react-hot-toast").default;
    toast.success("Welcome to the JEWELS private circle ✨");
  };

  return (
    <section
      ref={sectionRef}
      id="newsletter"
      className="py-20 sm:py-24 md:py-32 relative overflow-hidden content-auto"
      style={{ perspective: "1200px" }}
    >
      {/* Animated gold mesh gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.04) 0%, transparent 50%),
            linear-gradient(180deg, #0E0E0E 0%, #0A0A0A 100%)
          `,
        }}
      />

      {/* Gold border lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

      <div className="container-custom relative z-10 max-w-2xl text-center px-4 sm:px-6">
        <p className="nl-reveal section-label mb-2 sm:mb-3">Stay in the Loop</p>
        <h2 className="nl-reveal section-heading mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl">
          Get Exclusive Offers
        </h2>
        <p className="nl-reveal text-white/50 text-xs sm:text-sm mb-8 sm:mb-12 font-light max-w-lg mx-auto">
          Subscribe and be the first to know about new collections, early access
          sales, and jewellery care tips.
        </p>

        <form
          className="nl-reveal flex flex-col sm:flex-row max-w-md mx-auto border border-gold/25 bg-dark-50/70 backdrop-blur-md overflow-hidden group focus-within:border-gold/60 transition-colors duration-500 shadow-xl"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="Your email address"
            className="flex-1 px-4 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm bg-transparent text-white placeholder:text-white/30 focus:outline-none focus:ring-0 font-light border-b sm:border-b-0 sm:border-r border-gold/20"
          />
          <button
            type="submit"
            className="bg-gold text-dark px-6 sm:px-8 py-3.5 sm:py-4 text-xs tracking-widest uppercase font-semibold hover:bg-gold-light transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Send size={13} />
            Subscribe
          </button>
        </form>

        <p className="nl-reveal text-white/30 text-[11px] mt-4 sm:mt-6 font-light">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
