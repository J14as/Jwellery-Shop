"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ShoppingCart, Heart, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";

const NAV = [
  { label: "Rings",       href: "/categories/rings" },
  { label: "Earrings",    href: "/categories/earrings" },
  { label: "Necklaces",   href: "/categories/necklaces" },
  { label: "Bracelets",   href: "/categories/bracelets" },
  { label: "Collections", href: "/categories" },
  { label: "About",       href: "/about" },
];

/* ── Magnetic Button helper ────────────────────────────────────── */
function MagneticIcon({ children, label, href }: { children: React.ReactNode; label: string; href?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
    ref.current.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
  }, []);

  const inner = (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="p-2 text-white/50 hover:text-gold transition-colors duration-300 cursor-pointer"
      style={{ transition: "transform 0.15s ease-out, color 0.3s ease" }}
      aria-label={label}
    >
      {children}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

/* ── Header Component ──────────────────────────────────────────── */
export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-dark-50 border-b border-gold/10 text-gold-200 py-2.5 text-center text-xs tracking-[0.2em] uppercase">
        Free insured shipping on orders above ₹5,000 &nbsp;·&nbsp; Certified Jewellery &nbsp;·&nbsp; Easy Returns
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-dark-100/80 backdrop-blur-xl border-b border-gold/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent border-b border-white/5"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none select-none group">
              <span className="font-serif text-2xl md:text-3xl text-white tracking-wider group-hover:text-gold transition-colors duration-500">
                JEWELS
              </span>
              <span className="text-[9px] tracking-[0.35em] text-gold/70 uppercase mt-0.5">
                Luxury Jewellery
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link-luxury"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              <MagneticIcon label="Wishlist" href="/wishlist">
                <div className="relative">
                  <Heart size={18} strokeWidth={1.5} />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold text-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-dark">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </MagneticIcon>

              <MagneticIcon label="Cart" href="/cart">
                <div className="relative">
                  <ShoppingCart size={18} strokeWidth={1.5} />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold text-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-dark">
                      {itemCount}
                    </span>
                  )}
                </div>
              </MagneticIcon>

              {/* User menu */}
              {session ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-1 text-white/50 hover:text-gold transition-colors duration-300 p-2"
                  >
                    <User size={18} strokeWidth={1.5} />
                    <ChevronDown size={12} />
                  </button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-2 w-48 glass-card z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gold/10">
                          <p className="text-xs text-warm-light truncate">{session.user?.name}</p>
                        </div>
                        <Link href="/account/profile" onClick={() => setUserOpen(false)}
                          className="block px-4 py-2.5 text-sm text-white/80 hover:text-gold hover:bg-white/5 transition-colors">
                          My Profile
                        </Link>
                        <Link href="/account/orders" onClick={() => setUserOpen(false)}
                          className="block px-4 py-2.5 text-sm text-white/80 hover:text-gold hover:bg-white/5 transition-colors">
                          My Orders
                        </Link>
                        {(session.user as any)?.role === "ADMIN" && (
                          <Link href="/admin/dashboard" onClick={() => setUserOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gold hover:bg-gold/10 transition-colors font-medium">
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gold/10">
                          <button onClick={() => { signOut(); setUserOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-white/40 hover:text-red-400 transition-colors">
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/auth/sign-in"
                  className="hidden md:block nav-link-luxury ml-2">
                  Sign In
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-white/70 hover:text-gold transition-colors duration-300 p-2 ml-1"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Drawer Overlay ── */}
        <AnimatePresence>
          {menuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Dimmed backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMenuOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Slide Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 right-0 bottom-0 w-[88vw] max-w-sm bg-[#0E0E0E] border-l border-gold/20 shadow-2xl flex flex-col justify-between overflow-hidden z-10"
              >
                {/* Drawer Header */}
                <div className="p-5 border-b border-gold/15 flex items-center justify-between">
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col leading-none"
                  >
                    <span className="font-serif text-xl text-white tracking-widest">JEWELS</span>
                    <span className="text-[8px] tracking-[0.3em] text-gold/70 uppercase mt-0.5">
                      Haute Joaillerie
                    </span>
                  </Link>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold transition-colors"
                    aria-label="Close navigation"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Drawer Links Body (Scrollable for all screen heights) */}
                <div className="flex-1 overflow-y-auto touch-scroll p-6 space-y-6">
                  {/* Category Nav */}
                  <div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gold/60 block mb-3 font-medium">
                      Creations &amp; Atelier
                    </span>
                    <div className="space-y-1">
                      {NAV.map((item, i) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * i, duration: 0.3 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between py-2.5 text-base font-serif text-white/90 hover:text-gold transition-colors border-b border-white/[0.04]"
                          >
                            <span>{item.label}</span>
                            <span className="text-gold/40 text-xs">→</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Shortcuts: Cart & Wishlist */}
                  <div className="pt-2">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gold/60 block mb-3 font-medium">
                      Your Selections
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        href="/cart"
                        onClick={() => setMenuOpen(false)}
                        className="p-3 bg-dark-50 border border-gold/20 flex items-center justify-between hover:border-gold transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs text-white">
                          <ShoppingCart size={15} className="text-gold" />
                          <span>Bag</span>
                        </div>
                        {mounted && (
                          <span className="text-[11px] font-bold text-gold bg-gold/15 px-2 py-0.5">
                            {itemCount}
                          </span>
                        )}
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={() => setMenuOpen(false)}
                        className="p-3 bg-dark-50 border border-gold/20 flex items-center justify-between hover:border-gold transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs text-white">
                          <Heart size={15} className="text-gold" />
                          <span>Wishlist</span>
                        </div>
                        {mounted && (
                          <span className="text-[11px] font-bold text-gold bg-gold/15 px-2 py-0.5">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* Patron Account Section */}
                  <div className="pt-2 border-t border-gold/15">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gold/60 block mb-3 font-medium">
                      Patron Services
                    </span>
                    {session ? (
                      <div className="space-y-2 bg-dark-50 p-3.5 border border-white/10 text-xs">
                        <div className="pb-2 border-b border-white/10">
                          <p className="text-white font-medium truncate">{session.user?.name}</p>
                          <p className="text-[11px] text-white/40 truncate">{session.user?.email}</p>
                        </div>
                        <Link
                          href="/account/orders"
                          onClick={() => setMenuOpen(false)}
                          className="block py-1.5 text-white/80 hover:text-gold transition-colors"
                        >
                          My Acquisitions &amp; Orders
                        </Link>
                        <Link
                          href="/account/profile"
                          onClick={() => setMenuOpen(false)}
                          className="block py-1.5 text-white/80 hover:text-gold transition-colors"
                        >
                          Atelier Profile &amp; Settings
                        </Link>
                        {(session.user as any)?.role === "ADMIN" && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setMenuOpen(false)}
                            className="block py-1.5 text-gold font-medium hover:underline"
                          >
                            Director Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            signOut();
                            setMenuOpen(false);
                          }}
                          className="w-full text-left pt-2 text-white/40 hover:text-red-400 border-t border-white/10 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/auth/sign-in"
                        onClick={() => setMenuOpen(false)}
                        className="w-full btn-gold justify-center py-3 text-xs"
                      >
                        Sign In as Patron
                      </Link>
                    )}
                  </div>
                </div>

                {/* Drawer Footer Contact */}
                <div className="p-5 border-t border-gold/15 bg-black/40 text-center">
                  <p className="text-[11px] text-white/50 mb-1">Concierge: +91 98765 43210</p>
                  <p className="text-[9px] text-white/30 tracking-widest uppercase">
                    Delhi Atelier · Mon - Sat 10am - 7pm
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
