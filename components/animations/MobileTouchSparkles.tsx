"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
  spin: number;
  spinSpeed: number;
}

const GOLD_PALETTE = [
  "rgba(255, 223, 128, ", // Light gold
  "rgba(212, 175, 55, ",  // Classic gold
  "rgba(245, 230, 180, ", // Champagne gold
  "rgba(255, 255, 255, ", // Diamond white
  "rgba(197, 160, 89, ",  // Antique gold
];

/**
 * MobileTouchSparkles
 * Renders an ultra-fast, 120fps hardware-accelerated canvas particle & glow system
 * that reacts to touch drags, swipes, and taps with luxurious gold diamond sparkles and stardust.
 */
export function MobileTouchSparkles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const maxParticles = 60; // Cap to maintain 120fps on mobile

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Spawn sparkles at (x, y)
    const spawnSparkles = (x: number, y: number, count = 3, isBurst = false) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= maxParticles) {
          particles.shift(); // Evict oldest
        }

        const angle = Math.random() * Math.PI * 2;
        const speed = isBurst ? Math.random() * 3 + 1.5 : Math.random() * 1.8 + 0.5;
        const baseColor = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];

        particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5, // gentle upward drift
          size: Math.random() * 3.5 + 1.5,
          alpha: 1,
          maxLife: isBurst ? 45 : 35,
          life: 0,
          color: baseColor,
          spin: Math.random() * Math.PI,
          spinSpeed: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    // Draw diamond 4-point star sparkle
    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
      color: string,
      alpha: number,
      rotation: number
    ) => {
      let rot = (Math.PI / 2) * 3 + rotation;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      c.save();
      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fillStyle = `${color}${alpha})`;
      c.shadowColor = "rgba(212, 175, 55, 0.8)";
      c.shadowBlur = outerRadius * 2;
      c.fill();
      c.restore();
    };

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.spin += p.spinSpeed;

        const progress = p.life / p.maxLife;
        p.alpha = Math.max(0, 1 - progress);

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Draw glittering diamond star
        drawStar(
          ctx,
          p.x,
          p.y,
          4,
          p.size,
          p.size * 0.35,
          p.color,
          p.alpha,
          p.spin
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Touch Event Handlers
    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        spawnSparkles(touch.clientX, touch.clientY, 4, true);
        if (auraRef.current) {
          auraRef.current.style.transform = `translate(${touch.clientX - 60}px, ${touch.clientY - 60}px)`;
          auraRef.current.style.opacity = "1";
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        spawnSparkles(touch.clientX, touch.clientY, 2, false);
        if (auraRef.current) {
          auraRef.current.style.transform = `translate(${touch.clientX - 60}px, ${touch.clientY - 60}px)`;
          auraRef.current.style.opacity = "0.75";
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        spawnSparkles(touch.clientX, touch.clientY, 5, true);
      }
      if (auraRef.current) {
        auraRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <>
      {/* Fullscreen touch sparkle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        aria-hidden="true"
      />
      {/* Dynamic mobile touch glowing aura */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 w-28 h-28 pointer-events-none z-40 rounded-full transition-opacity duration-300 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.08) 40%, transparent 70%)",
          filter: "blur(12px)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
        aria-hidden="true"
      />
    </>
  );
}
