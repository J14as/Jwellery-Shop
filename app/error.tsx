"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold)] font-medium mb-2">
          Experience Interrupted
        </p>
        
        <h1 className="font-serif text-2xl sm:text-3xl text-white font-light tracking-wide mb-3">
          Something went wrong
        </h1>
        
        <p className="text-sm text-[var(--color-muted)] mb-8 leading-relaxed">
          We encountered an unexpected issue while rendering this page. Please try refreshing or return home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="btn-gold flex items-center justify-center gap-2 text-xs py-3 px-6 rounded-full w-full sm:w-auto"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="btn-outline flex items-center justify-center gap-2 text-xs py-3 px-6 rounded-full w-full sm:w-auto"
          >
            <Home className="w-3.5 h-3.5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
