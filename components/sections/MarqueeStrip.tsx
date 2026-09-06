"use client";

const ITEMS = [
  "✦ Certified Gold & Diamond",
  "✦ Free Shipping Above ₹5,000",
  "✦ 30-Day Easy Returns",
  "✦ Hallmarked Jewellery",
  "✦ Handcrafted Excellence",
  "✦ Lifetime Exchange",
];

export function MarqueeStrip() {
  const content = ITEMS.join("     ");

  return (
    <div className="relative bg-gradient-to-r from-gold-500 via-gold to-gold-500 py-3.5 overflow-hidden group">
      <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
        {/* Double for seamless loop */}
        {[0, 1].map((idx) => (
          <span
            key={idx}
            className="text-dark text-[11px] tracking-[0.25em] uppercase font-medium mx-8 inline-block"
          >
            {content}
          </span>
        ))}
      </div>
    </div>
  );
}
