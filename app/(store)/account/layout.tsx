import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, Heart, LogOut, Sparkles } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/account/profile");
  }

  return (
    <div className="bg-dark min-h-screen pt-10 pb-28 text-white">
      <div className="container-custom">
        <div className="mb-10 pb-4 border-b border-gold/15 flex justify-between items-end">
          <div>
            <span className="section-label mb-1 block">Private Salon</span>
            <h1 className="font-serif text-4xl md:text-5xl text-white">My Account</h1>
          </div>
          <span className="text-xs text-gold uppercase tracking-widest hidden sm:block">
            Patron: {session.user.name || session.user.email}
          </span>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Sidebar Navigation (4 cols) */}
          <nav className="md:col-span-4 glass-card p-6 border border-gold/15 h-max space-y-2">
            <Link
              href="/account/profile"
              className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-gold hover:bg-white/5 border border-transparent hover:border-gold/20 transition-all duration-300"
            >
              <User size={18} className="text-gold" />
              <span>Patron Profile</span>
            </Link>

            <Link
              href="/account/orders"
              className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-gold hover:bg-white/5 border border-transparent hover:border-gold/20 transition-all duration-300"
            >
              <Package size={18} className="text-gold" />
              <span>Order Acquisitions</span>
            </Link>

            <Link
              href="/account/wishlist"
              className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-gold hover:bg-white/5 border border-transparent hover:border-gold/20 transition-all duration-300"
            >
              <Heart size={18} className="text-gold" />
              <span>Saved Wishlist</span>
            </Link>

            <Link
              href="/categories"
              className="flex items-center gap-3 px-4 py-3 text-sm text-gold hover:bg-gold/10 border border-gold/20 transition-all duration-300"
            >
              <Sparkles size={18} />
              <span>Browse Catalog</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-gold/15">
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors text-left"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </nav>

          {/* Main Content (8 cols) */}
          <div className="md:col-span-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
