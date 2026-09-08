"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps the page in Lenis smooth scroll integrated with GSAP ScrollTrigger.
 * On mobile/touch devices, leverages native 120Hz momentum scrolling with continuous ScrollTrigger synchronization.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Check if device is a mobile / touch device
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
        window.innerWidth < 1024);

    // On touch devices, allow native momentum scrolling while keeping GSAP ScrollTrigger active & synchronized
    if (isTouchDevice) {
      const handleNativeScroll = () => {
        ScrollTrigger.update();
      };

      window.addEventListener("scroll", handleNativeScroll, { passive: true });

      // Refresh ScrollTrigger after DOM renders
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => {
        window.removeEventListener("scroll", handleNativeScroll);
        clearTimeout(timer);
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite: false,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return <div id="smooth-wrapper" className="w-full">{children}</div>;
}
