import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "electric-blue": "#00D4FF",
        "neon-purple": "#A855F7",
        "crimson-red": "#FF2D55",
        "hot-pink": "#FF0080",
        "cyber-orange": "#FF6B00",
        "lime-green": "#39FF14",
        "deep-space": "#050714",
        "space-dark": "#0A0E1A",
        "glass-white": "rgba(255,255,255,0.05)",
        "glass-border": "rgba(255,255,255,0.1)",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(135deg, #00D4FF 0%, #A855F7 50%, #FF2D55 100%)",
        "blue-purple": "linear-gradient(135deg, #00D4FF 0%, #A855F7 100%)",
        "purple-pink": "linear-gradient(135deg, #A855F7 0%, #FF0080 100%)",
        "orange-red": "linear-gradient(135deg, #FF6B00 0%, #FF2D55 100%)",
        "green-blue": "linear-gradient(135deg, #39FF14 0%, #00D4FF 100%)",
        "deep-space": "radial-gradient(ellipse at top, #0d1233 0%, #050714 60%)",
        "card-glass": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "orbit": "orbit 8s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "gradient-shift": "gradientShift 4s ease infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "neon-flicker": "neonFlicker 3s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(0,212,255,0.5)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px rgba(0,212,255,0.9), 0 0 60px rgba(168,85,247,0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(60px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(60px) rotate(-360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        neonFlicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.8" },
          "94%": { opacity: "1" },
          "96%": { opacity: "0.7" },
          "97%": { opacity: "1" },
        },
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2)",
        "neon-purple": "0 0 20px rgba(168,85,247,0.5), 0 0 60px rgba(168,85,247,0.2)",
        "neon-red": "0 0 20px rgba(255,45,85,0.5), 0 0 60px rgba(255,45,85,0.2)",
        "neon-green": "0 0 20px rgba(57,255,20,0.5), 0 0 60px rgba(57,255,20,0.2)",
        "glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        "card": "0 25px 50px rgba(0,0,0,0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
