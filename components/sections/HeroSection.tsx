"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Floating Gold Particles ──────────────────────────────────── */
function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            background: `radial-gradient(circle, rgba(212,175,55,${Math.random() * 0.6 + 0.2}) 0%, transparent 70%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${Math.random() * 4 + 4}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── 3D Jewelry Element (CSS Perspective) ─────────────────────── */
function Jewelry3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (prefersReducedMotion || isMobile || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = ((e.clientY - centerY) / rect.height) * -15;
      const y = ((e.clientX - centerX) / rect.width) * 15;
      setRotation({ x, y });
    },
    [prefersReducedMotion, isMobile]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px] lg:w-[560px] lg:h-[560px]"
      style={{ perspective: "1200px" }}
    >
      {/* Glow ring behind */}
      <div
        className="absolute inset-0 rounded-full animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* 3D rotating container */}
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: prefersReducedMotion
            ? "none"
            : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Ring image */}
        <div className="absolute inset-[10%] rounded-full overflow-hidden">
          <Image
            src="/images/hero-ring.jpg"
            alt="Luxury diamond ring — hero piece"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 320px, (max-width: 1024px) 480px, 560px"
          />
        </div>

        {/* Gold orbital rings */}
        <div
          className="absolute inset-0 rounded-full border border-gold/20 animate-spin-slow"
          style={{ transform: "rotateX(75deg) rotateZ(0deg)" }}
        />
        <div
          className="absolute inset-[-5%] rounded-full border border-gold/10 animate-spin-slow"
          style={{
            transform: "rotateX(75deg) rotateZ(60deg)",
            animationDirection: "reverse",
            animationDuration: "25s",
          }}
        />
      </div>
    </div>
  );
}

/* ── Hero Section ──────────────────────────────────────────────── */
export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const jewelryRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    // Text stagger reveal
    const words = contentRef.current?.querySelectorAll(".hero-word");
    if (words?.length) {
      gsap.fromTo(
        words,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }

    // Subtitle and CTA reveal
    const subtitle = contentRef.current?.querySelector(".hero-subtitle");
    const cta = contentRef.current?.querySelector(".hero-cta");
    if (subtitle) {
      gsap.fromTo(subtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.9, ease: "power2.out" });
    }
    if (cta) {
      gsap.fromTo(cta, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1.1, ease: "power2.out" });
    }

    // Scroll-away: scale down and fade as user scrolls past
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: false,
      },
    });

    if (contentRef.current) {
      scrollTl.to(contentRef.current, {
        y: -80,
        opacity: 0,
        scale: 0.95,
        ease: "none",
      }, 0);
    }

    if (jewelryRef.current) {
      scrollTl.to(jewelryRef.current, {
        y: -60,
        opacity: 0,
        scale: 0.9,
        ease: "none",
      }, 0);
    }

    return () => {
      scrollTl.scrollTrigger?.kill();
      scrollTl.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)" }}
    >
      {/* Background gold radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(212,175,55,0.05) 0%, transparent 60%)",
        }}
      />

      <GoldParticles />

      <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0 py-20 lg:py-0">
        {/* Left: Content */}
        <div ref={contentRef} className="max-w-xl lg:max-w-lg xl:max-w-xl text-center lg:text-left">
          <p className="hero-word section-label mb-6" style={{ opacity: 0 }}>
            New Collection 2025
          </p>

          <h1 className="font-serif text-5xl md:text-7xl xl:text-8xl text-white leading-[1.05] mb-8">
            <span className="hero-word inline-block" style={{ opacity: 0 }}>Jewellery</span>
            <br />
            <span className="hero-word inline-block animate-shimmer" style={{ opacity: 0 }}>
              That Tells
            </span>
            <br />
            <span className="hero-word inline-block" style={{ opacity: 0 }}>Your Story</span>
          </h1>

          <p
            className="hero-subtitle text-white/50 text-base md:text-lg mb-12 leading-relaxed max-w-sm mx-auto lg:mx-0 font-light"
            style={{ opacity: 0 }}
          >
            Handcrafted luxury pieces certified for purity.
            Each jewel, a timeless chapter of your legacy.
          </p>

          <div className="hero-cta flex flex-wrap gap-4 justify-center lg:justify-start" style={{ opacity: 0 }}>
            <Link href="/categories/rings" className="btn-gold">
              Explore Collection <ArrowRight size={14} />
            </Link>
            <Link href="/about" className="btn-outline">
              Our Craft
            </Link>
          </div>
        </div>

        {/* Right: 3D Jewelry */}
        <div ref={jewelryRef} className="relative">
          <Jewelry3D />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
