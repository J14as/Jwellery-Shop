"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS = [
  { value: 10000, suffix: "+", label: "Pieces Crafted" },
  { value: 15, suffix: "+", label: "Years of Legacy" },
  { value: 50, suffix: "+", label: "Master Artisans" },
  { value: 99, suffix: "%", label: "Customer Satisfaction" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    gsap.fromTo(
      { val: 0 },
      { val: target },
      {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: function () {
          const current = Math.floor(this.targets()[0].val);
          el.textContent = current.toLocaleString() + suffix;
        },
      }
    );
  }, [target, suffix]);

  return (
    <span ref={ref} className="font-serif text-4xl md:text-5xl text-gold">
      0{suffix}
    </span>
  );
}

export function CraftsmanshipStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    // Parallax background
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        y: "-20%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    // Content reveal
    if (contentRef.current) {
      const elements = contentRef.current.querySelectorAll(".craft-reveal");
      gsap.fromTo(
        elements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 75%",
          },
        }
      );
    }

    // Page-turn exit
    gsap.to(sectionRef.current, {
      rotateY: -3,
      transformOrigin: "left center",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "bottom 60%",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (
          t.trigger === sectionRef.current ||
          t.trigger === bgRef.current ||
          t.trigger === contentRef.current
        ) {
          t.kill();
        }
      });
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="craftsmanship"
      className="relative py-20 sm:py-32 md:py-44 overflow-hidden content-auto"
      style={{ perspective: "1500px" }}
    >
      {/* Background Image with Parallax */}
      <div ref={bgRef} className="absolute inset-0 scale-[1.3]">
        <Image
          src="/images/craftsmanship.jpg"
          alt="Master artisan crafting jewellery"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-dark/80 sm:bg-dark/75" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.6) 100%)",
        }}
      />

      {/* Content */}
      <div ref={contentRef} className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center px-2 sm:px-0">
          <p className="craft-reveal section-label mb-4 sm:mb-6">Our Promise</p>

          <h2 className="craft-reveal font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 sm:mb-8 leading-tight">
            Crafted with Passion,
            <br />
            <span className="animate-shimmer">Certified for Life</span>
          </h2>

          <p className="craft-reveal text-white/60 max-w-lg mx-auto mb-8 sm:mb-12 leading-relaxed text-sm sm:text-base md:text-lg font-light">
            Every piece at Jewels is handcrafted by master artisans and certified by
            independent gemological labs — because your trust is our greatest ornament.
          </p>

          <div className="craft-reveal">
            <Link
              href="/about"
              className="btn-outline border-gold/40 hover:border-gold"
            >
              Our Story <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-14 sm:mt-24 max-w-4xl mx-auto">
          {STATS.map(({ value, suffix, label }) => (
            <div key={label} className="text-center craft-reveal p-3 sm:p-0 bg-dark-50/40 sm:bg-transparent border sm:border-0 border-gold/10">
              <CountUp target={value} suffix={suffix} />
              <p className="text-white/40 text-[10px] sm:text-xs tracking-[0.2em] uppercase mt-2">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
