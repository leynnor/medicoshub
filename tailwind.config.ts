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
        primary: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Specialty colors
        specialty: {
          cardiologia: "#ef4444",
          oncologia: "#a855f7",
          neurologia: "#6366f1",
          endocrinologia: "#eab308",
          pediatria: "#22c55e",
          psiquiatria: "#14b8a6",
          ginecologia: "#ec4899",
          infectologia: "#f97316",
          cirurgia: "#6b7280",
          "clinica-medica": "#15803d",
          reumatologia: "#f59e0b",
          nefrologia: "#06b6d4",
          pneumologia: "#0ea5e9",
          gastroenterologia: "#84cc16",
          dermatologia: "#f43f5e",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
