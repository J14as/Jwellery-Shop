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
 * Reusable 3D tilt-on-hover card component.
 * Tracks mouse position within the card and applies subtle rotateX/rotateY.
 * Disables on mobile (touch) and reduced-motion.
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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

      if (glareRef.current && glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(212,175,55,0.15) 0%, transparent 60%)`;
        glareRef.current.style.opacity = "1";
      }
    },
    [maxTilt, scale, glare, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
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
