import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeStrip } from "@/components/sections/MarqueeStrip";
import { FeaturedCollection } from "@/components/sections/FeaturedCollection";
import { CraftsmanshipStory } from "@/components/sections/CraftsmanshipStory";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export default function HomePage() {
  return (
    <div className="bg-dark">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Marquee Strip ────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── Featured Collection ──────────────────────────────────── */}
      <FeaturedCollection />

      {/* ── Craftsmanship Story ──────────────────────────────────── */}
      <CraftsmanshipStory />

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── Newsletter ───────────────────────────────────────────── */}
      <NewsletterSection />
    </div>
  );
}
