import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

const CATEGORIES_DATA = [
  {
    name: "Rings",
    slug: "rings",
    tagline: "Solitaires & Precious Bands",
    image: "/images/hero-ring.jpg",
    itemCount: "42 Designs",
    desc: "From iconic engagement solitaires to stackable diamond pavé bands, engineered for eternal radiance.",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    tagline: "Royal Filigree & Statement Chokers",
    image: "/images/products/necklace.jpg",
    itemCount: "28 Designs",
    desc: "Intricately hand-woven collars, delicate pendants, and grand bridal neckwear crafted in 22K pure gold.",
  },
  {
    name: "Earrings",
    slug: "earrings",
    tagline: "Chandeliers & Diamond Drops",
    image: "/images/products/earrings.jpg",
    itemCount: "36 Designs",
    desc: "Luminous diamond studs, cascading shoulder-dusters, and regal jhumkas designed for timeless allure.",
  },
  {
    name: "Bracelets & Bangles",
    slug: "bracelets",
    tagline: "Cuffs, Tennis & Heritage Bangles",
    image: "/images/products/bracelet.jpg",
    itemCount: "24 Designs",
    desc: "Hand-engraved heirloom kadas and fluid diamond tennis bracelets tailored for everyday luxury.",
  },
];

export const metadata = {
  title: "High Jewellery Collections | JEWELS",
  description: "Explore our curated suites of fine rings, necklaces, earrings, and heirloom bangles.",
};

export default function CategoriesOverviewPage() {
  return (
    <div className="bg-dark min-h-screen pt-12 pb-28">
      {/* Header */}
      <div className="container-custom mb-16 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs tracking-[0.25em] uppercase mb-4">
          <Sparkles size={13} />
          <span>Curated Haute Joaillerie</span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
          Timeless <span className="text-gold font-light">Collections</span>
        </h1>
        <p className="text-white/50 text-base md:text-lg font-light leading-relaxed">
          Each category represents a masterclass in proportion, rare gemology, and certified purity. Choose a realm of elegance to begin exploring.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {CATEGORIES_DATA.map((cat) => (
            <TiltCard key={cat.slug} className="group relative overflow-hidden glass-card rounded-none" maxTilt={4}>
              <Link href={`/categories/${cat.slug}`} className="block relative aspect-[4/3] md:aspect-[16/10] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                {/* Badge */}
                <div className="absolute top-6 right-6 z-10 text-[11px] tracking-[0.2em] uppercase font-medium text-gold/90 bg-dark/80 backdrop-blur-md px-3.5 py-1.5 border border-gold/20">
                  {cat.itemCount}
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 z-10">
                  <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium mb-2">
                    {cat.tagline}
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-white mb-3 group-hover:text-gold transition-colors duration-300">
                    {cat.name}
                  </h2>
                  <p className="text-white/60 text-sm font-light leading-relaxed max-w-md mb-6 line-clamp-2">
                    {cat.desc}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-gold group-hover:translate-x-1.5 transition-transform duration-300">
                    <span>Discover Category</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
