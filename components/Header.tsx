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

        {/* ── Mobile Full-Screen Overlay ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 top-0 z-40 bg-dark/98 backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col items-center justify-center h-full gap-8">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      delay: 0.05 + i * 0.06,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-serif text-3xl text-white/80 hover:text-gold transition-colors duration-300 tracking-wider"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-8 pt-8 border-t border-gold/20"
                >
                  {session ? (
                    <div className="flex flex-col items-center gap-4">
                      <Link href="/account/orders" onClick={() => setMenuOpen(false)}
                        className="text-sm text-white/60 hover:text-gold transition-colors">My Orders</Link>
                      <button onClick={() => { signOut(); setMenuOpen(false); }}
                        className="text-sm text-white/40 hover:text-red-400 transition-colors">Sign Out</button>
                    </div>
                  ) : (
                    <Link href="/auth/sign-in" onClick={() => setMenuOpen(false)}
                      className="text-sm tracking-[0.2em] uppercase text-gold font-medium">Sign In</Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
