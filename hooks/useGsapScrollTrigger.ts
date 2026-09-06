"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollTriggerCallback = (
  tl: gsap.core.Timeline,
  trigger: HTMLElement
) => void;

interface UseGsapScrollTriggerOptions {
  /** ScrollTrigger start position — default: "top 80%" */
  start?: string;
  /** ScrollTrigger end position — default: "bottom 20%" */
  end?: string;
  /** Whether to pin the trigger element */
  pin?: boolean;
  /** Whether to scrub the animation to scroll position */
  scrub?: boolean | number;
  /** Whether to show markers (debug) */
  markers?: boolean;
  /** Whether to disable the animation entirely */
  disabled?: boolean;
}

/**
 * Register a GSAP ScrollTrigger animation with auto-cleanup.
 *
 * @example
 * ```tsx
 * const ref = useGsapScrollTrigger((tl, el) => {
 *   tl.from(el.querySelectorAll('.card'), {
 *     y: 60, opacity: 0, stagger: 0.1
 *   });
 * }, { start: "top 80%" });
 *
 * return <div ref={ref}>...</div>;
 * ```
 */
export function useGsapScrollTrigger(
  callback: ScrollTriggerCallback,
  options: UseGsapScrollTriggerOptions = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || options.disabled) return;

    const trigger = ref.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: options.start ?? "top 80%",
        end: options.end ?? "bottom 20%",
        pin: options.pin ?? false,
        scrub: options.scrub ?? false,
        markers: options.markers ?? false,
      },
    });

    callback(tl, trigger);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [options.disabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
