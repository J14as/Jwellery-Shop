import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";
import {
  Sparkles,
  Compass,
  ArrowRight,
  Heart,
  ShoppingBag,
  Home,
  Gem,
} from "lucide-react";

export const metadata = {
  title: "404 - Creation Not Found | JEWELS Haute Joaillerie",
  description:
    "The requested page or jewellery piece could not be found. Explore our fine jewellery collections.",
};

export default function NotFound() {
  const showcaseProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="bg-dark text-white min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        {/* ── 404 Hero Section ── */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-gold/15">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container-custom relative z-10 text-center">
            {/* Jewel Icon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs tracking-[0.25em] uppercase mb-6 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <Gem size={14} className="animate-pulse" />
              <span>404 • An Elusive Gem</span>
            </div>

            {/* Glowing Big 404 Number */}
            <div className="relative my-2 select-none">
              <h1 className="font-serif text-7xl sm:text-9xl md:text-[140px] font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gold-light via-gold to-gold/20 leading-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <Sparkles size={160} className="text-gold" />
              </div>
            </div>

            {/* Descriptive Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Lost in Brilliance
            </h2>

            <p className="text-white/60 text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed mb-10">
              The creation or private salon you are looking for has been
              acquired into a private vault, relocated, or does not exist.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link
                href="/"
                className="px-6 py-3.5 bg-gold text-dark hover:bg-gold-light text-xs tracking-widest uppercase font-semibold transition-all duration-300 flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.25)]"
              >
                <Home size={14} />
                <span>Return to Grand Foyer</span>
              </Link>

              <Link
                href="/categories"
                className="px-6 py-3.5 border border-gold/40 text-gold hover:bg-gold hover:text-dark text-xs tracking-widest uppercase font-medium transition-all duration-300 flex items-center gap-2"
              >
                <Compass size={14} />
                <span>Explore Collections</span>
              </Link>

              <Link
                href="/wishlist"
                className="px-6 py-3.5 border border-white/15 text-white/80 hover:border-gold hover:text-gold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <Heart size={14} />
                <span>Saved Wishlist</span>
              </Link>

              <Link
                href="/cart"
                className="px-6 py-3.5 border border-white/15 text-white/80 hover:border-gold hover:text-gold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              >
                <ShoppingBag size={14} />
                <span>Shopping Bag</span>
              </Link>
            </div>

            {/* Category Quick Jump Pills */}
            <div className="pt-8 border-t border-gold/10 max-w-2xl mx-auto">
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 mb-4">
                Or jump directly to a curated atelier:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {[
                  { label: "Solitaire Rings", href: "/categories/rings" },
                  { label: "High Necklaces", href: "/categories/necklaces" },
                  { label: "Diamond Earrings", href: "/categories/earrings" },
                  { label: "Heritage Bracelets", href: "/categories/bracelets" },
                  { label: "All Masterpieces", href: "/categories" },
                ].map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="px-4 py-2 text-xs bg-dark-50 border border-white/10 hover:border-gold/50 text-white/70 hover:text-gold transition-all duration-300 rounded-sm"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Curated Recommendations Showcase ── */}
        <section className="py-20 bg-dark-100">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-gold/15 gap-4">
              <div>
                <span className="section-label mb-2 block">
                  Recommended For You
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-white">
                  Discover Our Iconic Creations
                </h3>
              </div>
              <Link
                href="/categories"
                className="text-xs text-gold hover:text-gold-light tracking-widest uppercase flex items-center gap-1.5 font-medium transition-colors group"
              >
                <span>View Full Catalog</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {showcaseProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  sellingPrice={p.sellingPrice}
                  mrp={p.mrp}
                  discount={p.discount}
                  images={p.images}
                  featured={p.featured}
                  bestSeller={p.bestSeller}
                  newArrival={p.newArrival}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
