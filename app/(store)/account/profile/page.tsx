import { auth } from "@/auth";
import { User, Mail, Shield, Sparkles } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="glass-card p-8 border border-gold/15 space-y-8 text-white">
      <div className="flex justify-between items-start pb-6 border-b border-gold/15">
        <div>
          <span className="section-label mb-1 block">Patron Dossier</span>
          <h2 className="font-serif text-3xl text-white">Account Profile</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs">
          <Sparkles size={13} />
          <span>VIP Atelier Tier</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-4 bg-dark-50 border border-gold/10">
          <span className="text-[11px] text-white/40 uppercase tracking-widest block mb-1">
            Registered Name
          </span>
          <div className="flex items-center gap-2 text-white font-medium text-base">
            <User size={16} className="text-gold" />
            <span>{user?.name || "Rohan Singhania"}</span>
          </div>
        </div>

        <div className="p-4 bg-dark-50 border border-gold/10">
          <span className="text-[11px] text-white/40 uppercase tracking-widest block mb-1">
            Security Email
          </span>
          <div className="flex items-center gap-2 text-white font-medium text-base truncate">
            <Mail size={16} className="text-gold flex-shrink-0" />
            <span className="truncate">{user?.email || "customer@jewels.com"}</span>
          </div>
        </div>

        <div className="p-4 bg-dark-50 border border-gold/10">
          <span className="text-[11px] text-white/40 uppercase tracking-widest block mb-1">
            Authentication Role
          </span>
          <div className="flex items-center gap-2 text-gold font-medium text-sm">
            <Shield size={16} className="text-gold" />
            <span>{(user as any)?.role || "VERIFIED PATRON"}</span>
          </div>
        </div>

        <div className="p-4 bg-dark-50 border border-gold/10">
          <span className="text-[11px] text-white/40 uppercase tracking-widest block mb-1">
            Member Since
          </span>
          <p className="text-white text-sm">2025 • High Jewellery Salon</p>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-gold/10 via-dark-50 to-gold/5 border border-gold/20">
        <h3 className="font-serif text-lg text-white mb-2">Bespoke Concierge Privileges</h3>
        <p className="text-white/60 text-xs font-light leading-relaxed">
          As a registered patron of JEWELS, you enjoy priority allocation on limited solstice releases, complimentary annual gemstone inspections, and private salon appointments in New Delhi.
        </p>
      </div>
    </div>
  );
}
