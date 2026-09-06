import Image from "next/image";
import Link from "next/link";
import { Award, Gem, ShieldCheck, HeartHandshake, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Our Heritage & Craftsmanship | JEWELS Haute Joaillerie",
  description: "Discover the heritage of JEWELS — an atelier of master goldsmiths, ethical diamonds, and bespoke heirloom craftsmanship since 2010.",
};

const VALUES = [
  {
    icon: Gem,
    title: "Rare Conflict-Free Gems",
    desc: "Every diamond and gemstone is ethically sourced in adherence with the Kimberley Process and certified by GIA / IGI.",
  },
  {
    icon: Award,
    title: "Master Goldsmithing",
    desc: "Over 80+ hours of painstaking handcrafting goes into each filigree piece, preserving century-old royal techniques.",
  },
  {
    icon: ShieldCheck,
    title: "100% BIS Hallmarked",
    desc: "Guaranteed purity with laser-inscribed BIS hallmarking on every karat of gold, platinum, and fine silver.",
  },
  {
    icon: HeartHandshake,
    title: "Lifetime Guarantee",
    desc: "Complimentary ultrasonic cleaning, annual prong tightening, and lifetime buyback & exchange privileges.",
  },
];

const TIMELINE = [
  {
    year: "2010",
    title: "The Atelier Conceived",
    desc: "Founded in New Delhi as a bespoke private salon dedicated to creating singular heirloom diamond jewellery.",
  },
  {
    year: "2015",
    title: "The Royal Filigree Suite",
    desc: "Unveiled our signature hand-woven 22K gold lace collection, winning prestigious national jewelry design honours.",
  },
  {
    year: "2020",
    title: "Ethical Diamond Pledge",
    desc: "Transitioned 100% of our gemstone supply chain to verified fair-trade mines and zero-carbon certified labs.",
  },
  {
    year: "Present",
    title: "Global Haute Joaillerie",
    desc: "Delivering bespoke luxury to patrons across 18 countries while staying true to our artisanal workbench heritage.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-dark text-white min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-gold/15">
        <Image
          src="/images/craftsmanship.jpg"
          alt="Jewelry artisan atelier"
          fill
          className="object-cover opacity-35 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/40" />

        <div className="container-custom relative z-10 text-center max-w-4xl py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs tracking-[0.3em] uppercase mb-6">
            <Sparkles size={13} />
            <span>The Heritage of JEWELS</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.05]">
            Where Passion Meets <br />
            <span className="text-gold font-light italic">Perfection</span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
            For over a decade, we have sculpted dreams into timeless adornments — each piece an enduring monument to love, legacy, and unapologetic elegance.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/categories" className="btn-gold">
              Explore Creations <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section className="py-24 md:py-32 border-b border-gold/10 relative">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image composition */}
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden border border-gold/20">
                <Image
                  src="/images/hero-ring.jpg"
                  alt="Crafted diamond solitaire"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-1/2 aspect-square border-2 border-gold/40 hidden sm:block p-3 bg-dark-100">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/products/necklace.jpg"
                    alt="Gold filigree necklace"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right: Narrative */}
            <div>
              <span className="section-label mb-3 block">Artisanal Roots</span>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
                Sculpted by Hand, <br />
                Treasured for Generations
              </h2>
              <p className="text-white/60 text-base md:text-lg font-light leading-relaxed mb-6">
                In a world of mass automated production, JEWELS remains defiantly devoted to the slow, sacred art of master goldsmithing. We believe fine jewellery is not manufactured — it is born at the bench under the patient hands of artisans who have honed their craft for decades.
              </p>
              <p className="text-white/60 text-base md:text-lg font-light leading-relaxed mb-10">
                Every bezel is calibrated by eye. Every diamond prong is micro-sculpted under high-magnification optics. We do not rush perfection, because an heirloom is made once, but cherished forever.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gold/15">
                <div>
                  <span className="font-serif text-3xl md:text-4xl text-gold block mb-1">
                    100%
                  </span>
                  <span className="text-white/50 text-xs tracking-wider uppercase">
                    Certified Natural Diamonds
                  </span>
                </div>
                <div>
                  <span className="font-serif text-3xl md:text-4xl text-gold block mb-1">
                    80+ Hrs
                  </span>
                  <span className="text-white/50 text-xs tracking-wider uppercase">
                    Handwork Per Masterpiece
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars of Excellence ── */}
      <section className="py-24 md:py-32 bg-dark-50/50 border-b border-gold/10">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="section-label mb-3 block">The Atelier Standard</span>
            <h2 className="section-heading mb-4">Our Four Pillars</h2>
            <p className="text-white/50 text-sm md:text-base font-light">
              The foundational codes that govern every diamond selected and every gold ounce poured in our atelier.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="glass-card p-8 border border-gold/15 hover:border-gold/40 transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold mb-6 group-hover:scale-110 group-hover:bg-gold group-hover:text-dark transition-all duration-300">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-xl text-white mb-3">{val.title}</h3>
                  <p className="text-white/55 text-sm font-light leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-24 md:py-32">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-20">
            <span className="section-label mb-3 block">Milestones</span>
            <h2 className="section-heading">The Journey of JEWELS</h2>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gold/20">
            {TIMELINE.map((item, index) => (
              <div
                key={item.year}
                className={`relative flex flex-col md:flex-row items-start ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Center dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold border-4 border-dark z-10 mt-1.5" />

                {/* Content */}
                <div className="ml-12 md:ml-0 md:w-1/2 px-0 md:px-10">
                  <div className="glass-card p-6 md:p-8 border border-gold/15">
                    <span className="text-gold font-serif text-2xl font-bold block mb-1">
                      {item.year}
                    </span>
                    <h3 className="text-white font-medium text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Atelier Quote ── */}
      <section className="py-28 bg-gradient-to-b from-dark-50 via-dark-100 to-dark text-center border-t border-gold/15">
        <div className="container-custom max-w-3xl">
          <Sparkles size={24} className="text-gold mx-auto mb-6 opacity-80" />
          <blockquote className="font-serif text-2xl md:text-4xl text-white font-light italic leading-relaxed mb-6">
            &ldquo;We don&apos;t simply set stones into metal; we capture moments of eternal light so you can wear them close to your heart.&rdquo;
          </blockquote>
          <p className="text-gold text-xs tracking-[0.25em] uppercase font-semibold">
            — Master Goldsmith & Founder
          </p>
        </div>
      </section>
    </div>
  );
}
