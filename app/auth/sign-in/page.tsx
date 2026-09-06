"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/checkout";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "customer@jewels.com",
    password: "customer123",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please use demo credentials.");
      } else {
        toast.success("Welcome back to JEWELS Atelier ✨");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (email: string, pass: string) => {
    setFormData({ email, password: pass });
    toast.success("Demo credentials loaded!");
  };

  return (
    <div className="bg-dark min-h-screen pt-12 pb-24 text-white flex items-center justify-center">
      <div className="container-custom max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="font-serif text-3xl text-white tracking-widest block">JEWELS</span>
            <span className="text-[9px] tracking-[0.35em] text-gold uppercase block mt-0.5">
              Haute Joaillerie
            </span>
          </Link>
          <h1 className="font-serif text-2xl md:text-3xl text-white">Atelier Patron Sign In</h1>
          <p className="text-white/50 text-xs mt-2 font-light">
            Sign in to access your certified acquisitions, bespoke wishlist, and express checkout.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 md:p-10 border border-gold/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-white/50 block mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="patron@jewels.com"
                  className="w-full bg-dark-50 border border-gold/20 p-3.5 pl-10 text-sm text-white focus:outline-none focus:border-gold placeholder:text-white/20 transition-colors"
                  required
                />
                <Mail size={16} className="text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-medium">
                  Password
                </label>
                <span className="text-[11px] text-gold/70 hover:text-gold cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full bg-dark-50 border border-gold/20 p-3.5 pl-10 text-sm text-white focus:outline-none focus:border-gold placeholder:text-white/20 transition-colors"
                  required
                />
                <Lock size={16} className="text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold justify-center py-4 text-xs tracking-widest uppercase font-semibold disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating..." : "Sign In to Proceed"} <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gold/15">
            <span className="text-[10px] text-white/40 uppercase tracking-widest block text-center mb-3">
              One-Click Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill("customer@jewels.com", "customer123")}
                className="p-2.5 bg-dark-50 border border-gold/30 hover:border-gold text-gold text-xs rounded-none transition-colors text-center"
              >
                <span className="block font-medium">Patron Account</span>
                <span className="text-[10px] text-white/40 block">customer@jewels.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("admin@jewels.com", "admin123")}
                className="p-2.5 bg-dark-50 border border-white/10 hover:border-gold text-white/70 hover:text-gold text-xs rounded-none transition-colors text-center"
              >
                <span className="block font-medium">Atelier Director</span>
                <span className="text-[10px] text-white/40 block">admin@jewels.com</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-white/40 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-gold" />
          <span>256-bit Encrypted Private Session</span>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-dark min-h-screen flex items-center justify-center text-gold text-xs tracking-widest uppercase">
          Loading Atelier Authentication...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
