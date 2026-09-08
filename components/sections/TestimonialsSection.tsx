"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    quote:
      "The solitaire ring exceeded every expectation. The craftsmanship is extraordinary — it sparkles like nothing I've ever owned. Truly a generational piece.",
    purchase: "Eternal Solitaire Ring",
  },
  {
    id: 2,
    name: "Ananya Reddy",
    location: "Hyderabad",
    rating: 5,
    quote:
      "From the moment I opened the box, I knew this was special. The necklace is breathtaking, and the packaging felt like unwrapping a piece of art.",
    purchase: "Royal Filigree Necklace",
  },
  {
    id: 3,
    name: "Meera Kapoor",
    location: "Delhi",
    rating: 5,
    quote:
      "I've been a loyal customer for three years now. Every piece I've purchased has been of impeccable quality. Their attention to detail is unmatched.",
    purchase: "Heritage Gold Bangle",
  },
  {
    id: 4,
    name: "Ritu Agarwal",
    location: "Jaipur",
    rating: 4,
    quote:
      "The cascade earrings are absolutely stunning. I wore them to my sister's wedding, and everyone asked where I got them. Pure elegance.",
    purchase: "Cascade Diamond Earrings",
  },
  {
    id: 5,
    name: "Kavya Nair",
    location: "Bangalore",
    rating: 5,
    quote:
      "Impeccable service, stunning jewellery, and beautiful presentation. The stacking rings are now my everyday luxury. Simply perfect.",
    purchase: "Trinity Stacking Rings",
  },
];

function TestimonialCard({
  testimonial,
  index: _index,
}: {
  testimonial: (typeof TESTIMONIALS)[0];
  index: number;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-[82vw] max-w-[340px] md:w-[380px] h-[300px] sm:h-[320px] cursor-pointer select-none"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 ease-luxury"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front — Quote */}
        <div
          className="absolute inset-0 backface-hidden glass-card p-6 sm:p-8 flex flex-col justify-between border border-gold/15"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Stars */}
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < testimonial.rating ? "text-gold fill-gold" : "text-white/20"}
              />
            ))}
          </div>

          {/* Quote */}
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed italic font-light">
            &ldquo;{testimonial.quote}&rdquo;
          </p>

          {/* Hint */}
          <p className="text-gold/60 text-[10px] tracking-widest uppercase flex items-center gap-1">
            <span className="md:hidden">Tap to reveal patron ↻</span>
            <span className="hidden md:inline">Hover to reveal patron ↻</span>
          </p>
        </div>

        {/* Back — Customer Info */}
        <div
          className="absolute inset-0 backface-hidden glass-card p-6 sm:p-8 flex flex-col items-center justify-center text-center border border-gold/25"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Avatar */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
            <span className="font-serif text-xl sm:text-2xl text-dark font-bold">
              {testimonial.name[0]}
            </span>
          </div>

          <h4 className="font-serif text-lg sm:text-xl text-white mb-0.5">
            {testimonial.name}
          </h4>
          <p className="text-white/40 text-[11px] tracking-wider uppercase mb-3 sm:mb-4">
            {testimonial.location}
          </p>

          <div className="w-8 h-px bg-gold/40 mb-3" />

          <p className="text-gold text-[10px] sm:text-xs tracking-wider uppercase">
            Acquired Creation
          </p>
          <p className="text-white/70 text-xs sm:text-sm mt-0.5 font-light">{testimonial.purchase}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -340 : 340;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    // Fan-out entry animation
    const cards = sectionRef.current.querySelectorAll(".testimonial-card-wrap");
    gsap.fromTo(
      cards,
      {
        x: 0,
        opacity: 0,
        rotateZ: (i) => (i % 2 === 0 ? -4 : 4),
        scale: 0.95,
      },
      {
        x: 0,
        opacity: 1,
        rotateZ: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
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
      id="testimonials"
      className="py-20 sm:py-24 md:py-32 relative overflow-hidden content-auto"
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #0D0D0D 50%, #0A0A0A 100%)",
      }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.03) 0%, transparent 50%)",
        }}
      />

      <div className="container-custom relative z-10">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="section-label mb-2 sm:mb-3">What They Say</p>
          <h2 className="section-heading">Voices of Elegance</h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 bg-dark-50 border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-all duration-300 hidden md:flex"
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 bg-dark-50 border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-all duration-300 hidden md:flex"
            aria-label="Next testimonials"
          >
            <ChevronRight size={18} />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x snap-mandatory touch-scroll"
          >
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={testimonial.id}
                className="testimonial-card-wrap snap-center shrink-0"
              >
                <TestimonialCard testimonial={testimonial} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
