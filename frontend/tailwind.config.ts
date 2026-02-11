import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
        },
        surface: {
          950: "#09090B",
          900: "#18181B",
          850: "#1E1E22",
          800: "#27272A",
          700: "#3F3F46",
          600: "#52525B",
          500: "#71717A",
          400: "#A1A1AA",
          300: "#D4D4D8",
          200: "#E4E4E7",
          100: "#F4F4F5",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["DM Sans", "Nunito Sans", "sans-serif"],
      },
      animation: {
        "fence-pulse": "fencePulse 2s ease-in-out infinite alternate",
        glow: "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        fencePulse: {
          "0%": { opacity: "0.3" },
          "100%": { opacity: "0.7" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(6, 182, 212, 0.1)" },
          "100%": { boxShadow: "0 0 40px rgba(6, 182, 212, 0.2)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
