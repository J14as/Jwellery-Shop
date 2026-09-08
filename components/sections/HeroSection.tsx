"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Floating Gold Particles (Hydration-Safe & Mobile Enabled) ─────────────────── */
const PARTICLE_PRESETS = [
  { size: 2, left: 12, top: 20, delay: 0.5, dur: 6.2, opacity: 0.4 },
  { size: 3, left: 84, top: 15, delay: 1.2, dur: 7.5, opacity: 0.5 },
  { size: 1.5, left: 28, top: 65, delay: 2.1, dur: 5.8, opacity: 0.35 },
  { size: 3.5, left: 72, top: 78, delay: 0.8, dur: 8.0, opacity: 0.45 },
  { size: 2.5, left: 45, top: 32, delay: 3.0, dur: 6.8, opacity: 0.5 },
  { size: 2, left: 90, top: 48, delay: 1.7, dur: 7.1, opacity: 0.3 },
  { size: 3.5, left: 18, top: 85, delay: 2.5, dur: 6.4, opacity: 0.4 },
  { size: 1.8, left: 60, top: 10, delay: 3.4, dur: 7.9, opacity: 0.35 },
  { size: 2.8, left: 38, top: 90, delay: 1.9, dur: 5.5, opacity: 0.4 },
  { size: 3, left: 80, top: 60, delay: 0.2, dur: 6.9, opacity: 0.45 },
  { size: 2.2, left: 5, top: 42, delay: 2.8, dur: 7.3, opacity: 0.3 },
  { size: 3.2, left: 68, top: 38, delay: 1.5, dur: 6.1, opacity: 0.5 },
];

function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
      {PARTICLE_PRESETS.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(212,175,55,${p.opacity}) 0%, transparent 70%)`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── 3D Jewelry Element (Touch-Interactive & CSS 3D Perspective) ─── */
function Jewelry3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (prefersReducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = ((e.clientY - centerY) / rect.height) * -16;
      const y = ((e.clientX - centerX) / rect.width) * 16;
      setRotation({ x, y });
    },
    [prefersReducedMotion]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (prefersReducedMotion || e.touches.length === 0) return;
    setIsInteracting(true);
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      rotX: rotation.x,
      rotY: rotation.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (prefersReducedMotion || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;
    
    // Scale delta for natural feel
    const newRotX = Math.max(-25, Math.min(25, touchStartRef.current.rotX - dy * 0.25));
    const newRotY = Math.max(-25, Math.min(25, touchStartRef.current.rotY + dx * 0.25));
    
    setRotation({ x: newRotX, y: newRotY });
  };

  const handleTouchEnd = () => {
    setIsInteracting(false);
    // Smooth reset
    setTimeout(() => {
      setRotation({ x: 0, y: 0 });
    }, 150);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative w-[280px] h-[280px] xs:w-[320px] xs:h-[320px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] lg:w-[540px] lg:h-[540px] mx-auto select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ perspective: "1200px" }}
    >
      {/* Glow ring behind */}
      <div
        className="absolute inset-0 rounded-full animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.08) 40%, transparent 70%)",
          filter: "blur(35px)",
        }}
      />

      {/* 3D rotating container */}
      <div
        className={`relative w-full h-full ${
          isInteracting ? "transition-none" : "transition-transform duration-500 ease-out"
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: prefersReducedMotion
            ? "none"
            : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Ring image */}
        <div className="absolute inset-[10%] rounded-full overflow-hidden border border-gold/30 shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.2)] group">
          <Image
            src="/images/hero-ring.jpg"
            alt="Luxury diamond ring — hero piece"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 460px, 540px"
          />
          {/* Specular shimmer gloss */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-tr from-transparent via-white/10 to-gold/20 mix-blend-overlay"
            style={{
              transform: `translateX(${rotation.y * 2}px) translateY(${rotation.x * 2}px)`,
              transition: "transform 0.1s linear",
            }}
          />
        </div>

        {/* Gold orbital rings */}
        <div
          className="absolute inset-0 rounded-full border border-gold/25 animate-spin-slow pointer-events-none"
          style={{ transform: "rotateX(75deg) rotateZ(0deg)" }}
        />
        <div
          className="absolute inset-[-5%] rounded-full border border-gold/15 animate-spin-slow pointer-events-none"
          style={{
            transform: "rotateX(75deg) rotateZ(60deg)",
            animationDirection: "reverse",
            animationDuration: "25s",
          }}
        />

        {/* Mobile touch hint badge */}
        <div className="md:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-gold/30 flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3 h-3 text-gold animate-pulse" />
          <span className="text-[10px] tracking-widest text-gold/90 uppercase font-medium">Touch to Rotate</span>
        </div>
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
          delay: 0.2,
        }
      );
    }

    // Subtitle and CTA reveal
    const subtitle = contentRef.current?.querySelector(".hero-subtitle");
    const cta = contentRef.current?.querySelector(".hero-cta");
    if (subtitle) {
      gsap.fromTo(subtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.8, ease: "power2.out" });
    }
    if (cta) {
      gsap.fromTo(cta, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1.0, ease: "power2.out" });
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
      className="relative min-h-[92dvh] sm:min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)" }}
    >
      {/* Background gold radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)",
        }}
      />

      <GoldParticles />

      <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-0 py-12 sm:py-20 lg:py-0 w-full">
        {/* Left: Content */}
        <div ref={contentRef} className="max-w-xl lg:max-w-lg xl:max-w-xl text-center lg:text-left w-full">
          <p className="hero-word section-label mb-4 sm:mb-6" style={{ opacity: 0 }}>
            New Collection 2025
          </p>

          <h1 className="font-serif text-4xl xs:text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-white leading-[1.08] sm:leading-[1.05] mb-6 sm:mb-8">
            <span className="hero-word inline-block" style={{ opacity: 0 }}>Jewellery</span>
            <br />
            <span className="hero-word inline-block animate-shimmer" style={{ opacity: 0 }}>
              That Tells
            </span>
            <br />
            <span className="hero-word inline-block" style={{ opacity: 0 }}>Your Story</span>
          </h1>

          <p
            className="hero-subtitle text-white/60 text-sm sm:text-base md:text-lg mb-8 sm:mb-12 leading-relaxed max-w-sm sm:max-w-md mx-auto lg:mx-0 font-light px-2 sm:px-0"
            style={{ opacity: 0 }}
          >
            Handcrafted luxury pieces certified for purity.
            Each jewel, a timeless chapter of your legacy.
          </p>

          <div className="hero-cta flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center lg:justify-start w-full max-w-xs xs:max-w-none mx-auto lg:mx-0" style={{ opacity: 0 }}>
            <Link href="/categories/rings" className="btn-gold w-full xs:w-auto text-center">
              Explore Collection <ArrowRight size={14} />
            </Link>
            <Link href="/about" className="btn-outline w-full xs:w-auto text-center">
              Our Craft
            </Link>
          </div>
        </div>

        {/* Right: 3D Jewelry with Touch Controls */}
        <div ref={jewelryRef} className="relative w-full lg:w-auto flex justify-center">
          <Jewelry3D />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 z-10 pointer-events-none">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
