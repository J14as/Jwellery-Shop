import React from "react";
import { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "JEWELS — Haute Joaillerie & Fine Diamonds",
  description: "Discover certified, handcrafted luxury jewellery. Rings, earrings, necklaces, and bespoke heirlooms.",
  applicationName: "JEWELS Haute Joaillerie",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JEWELS",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`} suppressHydrationWarning>
      <body className="bg-dark text-white antialiased selection:bg-gold/30 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
