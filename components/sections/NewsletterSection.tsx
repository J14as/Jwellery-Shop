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

  return (
    <section
      ref={sectionRef}
      id="newsletter"
      className="py-24 md:py-32 relative overflow-hidden"
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

      <div className="container-custom relative z-10 max-w-2xl text-center">
        <p className="nl-reveal section-label mb-3">Stay in the Loop</p>
        <h2 className="nl-reveal section-heading mb-4">
          Get Exclusive Offers
        </h2>
        <p className="nl-reveal text-white/40 text-sm mb-12">
          Subscribe and be the first to know about new collections, early access
          sales, and jewellery care tips.
        </p>

        <form
          className="nl-reveal flex gap-0 max-w-md mx-auto border border-gold/20 bg-dark-50/50 backdrop-blur-sm overflow-hidden group focus-within:border-gold/50 transition-colors duration-500"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-6 py-4 text-sm bg-transparent text-white placeholder:text-white/30 focus:outline-none focus:ring-0 font-light"
          />
          <button
            type="submit"
            className="bg-gold text-dark px-8 py-4 text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300 flex items-center gap-2 whitespace-nowrap"
          >
            <Send size={13} />
            Subscribe
          </button>
        </form>

        <p className="nl-reveal text-white/20 text-xs mt-6">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
