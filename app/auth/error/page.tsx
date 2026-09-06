import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="bg-dark min-h-screen pt-24 pb-28 text-white flex items-center justify-center">
      <div className="container-custom max-w-md text-center glass-card p-10 border border-red-500/30">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto mb-6">
          <AlertCircle size={32} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl md:text-3xl text-white mb-3">Authentication Notice</h1>
        <p className="text-white/60 text-sm font-light mb-8 leading-relaxed">
          The requested authentication session could not be completed. Please sign in with your credentials or demo account.
        </p>
        <Link href="/auth/sign-in" className="btn-gold justify-center w-full">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}
