import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#fdf8f0",
          100: "#f5ead8",
          200: "#e8d5b0",
          300: "#d4b896",
          400: "#bc9470",
          500: "#a07040",
          600: "#7a5230",
          700: "#5c3a1e",
          800: "#3d2410",
          900: "#1e1008"
        },
        terracotta: {
          DEFAULT: "#c8602a",
          light: "#f0ddd0"
        },
        sage: {
          DEFAULT: "#4a7c6f",
          light: "#d4e8e4"
        },
        "warm-white": "#fffcf7"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"]
      },
      boxShadow: {
        soft: "0 2px 16px rgba(92, 58, 30, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
