"use client";

import { useRef, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
}

/**
 * Reusable 3D tilt-on-hover & tilt-on-touch card component.
 * Tracks mouse & touch position within the card, applying dynamic rotateX/rotateY
 * and spotlight glare on mobile touch movement.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  scale = 1.02,
  speed = 400,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const applyTilt = useCallback(
    (clientX: number, clientY: number) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;

      if (glareRef.current && glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(212,175,55,0.22) 0%, transparent 65%)`;
        glareRef.current.style.opacity = "1";
      }
    },
    [maxTilt, scale, glare]
  );

  const resetTilt = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      applyTilt(e.clientX, e.clientY);
    },
    [applyTilt, prefersReducedMotion]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || e.touches.length === 0) return;
      const touch = e.touches[0];
      applyTilt(touch.clientX, touch.clientY);
    },
    [applyTilt, prefersReducedMotion]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || e.touches.length === 0) return;
      const touch = e.touches[0];
      applyTilt(touch.clientX, touch.clientY);
    },
    [applyTilt, prefersReducedMotion]
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={resetTilt}
      onTouchCancel={resetTilt}
      className={`relative active:scale-[0.98] ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
        willChange: "transform",
      }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none rounded-inherit z-10 transition-opacity duration-300"
          style={{ opacity: 0 }}
        />
      )}
    </div>
  );
}
