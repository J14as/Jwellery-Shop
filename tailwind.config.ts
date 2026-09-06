/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury dark palette
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8D5A3",
          dark: "#9A7529",
          50: "#FBF6E9",
          100: "#F5EAC8",
          200: "#EDD98F",
          300: "#E0C056",
          400: "#D4AF37",
          500: "#B8962E",
          600: "#7A5C1E",
          700: "#5A4115",
        },
        champagne: {
          DEFAULT: "#D4AF37",
          light: "#F0DFA0",
          muted: "#B8962E",
        },
        cream: {
          DEFAULT: "#FAF8F3",
          50: "#FDFCFA",
          100: "#FAF8F3",
          200: "#F2EDE0",
          300: "#E8DFCA",
        },
        dark: {
          DEFAULT: "#0A0A0A",
          50: "#1A1A1A",
          100: "#141414",
          200: "#0D0D0D",
          300: "#060606",
        },
        warm: {
          gray: "#6B5E4E",
          light: "#9C8E80",
        },
        ivory: "#F5F0E8",
        charcoal: "#0A0A0A",
        "champagne-gold": "#D4AF37",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "7xl": ["4.5rem", { lineHeight: "1.1" }],
        "8xl": ["6rem", { lineHeight: "1.05" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      letterSpacing: {
        widest: "0.25em",
        "ultra-wide": "0.4em",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #D4AF37 0%, #F0DFA0 50%, #D4AF37 100%)",
        "dark-gradient":
          "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.95) 100%)",
        "dark-vignette":
          "radial-gradient(ellipse at center, rgba(10,10,10,0) 0%, rgba(10,10,10,0.8) 100%)",
        "gold-radial":
          "radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%)",
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
        "luxury-in": "cubic-bezier(0.55, 0, 1, 0.45)",
        "luxury-out": "cubic-bezier(0, 0.55, 0.45, 1)",
      },
      perspective: {
        "1000": "1000px",
        "1500": "1500px",
        "2000": "2000px",
      },
    },
  },
  plugins: [],
};
