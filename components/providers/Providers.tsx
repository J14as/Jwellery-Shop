"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#141414",
            color: "#F5F0E8",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#D4AF37",
              secondary: "#0A0A0A",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#0A0A0A",
            },
          },
        }}
      />
      {children}
    </SessionProvider>
  );
}
