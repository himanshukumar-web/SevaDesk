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
        seva: {
          navy: {
            50: "#f0f5fa",
            100: "#e2ecf5",
            500: "#22649a",
            700: "#13426b",
            800: "#0e3150",
            900: "#0a2238",
            950: "#061524",
          },
          green: {
            50: "#ecfdf5",
            100: "#d1fae5",
            500: "#10b981",
            600: "#059669",
            700: "#047857",
            800: "#065f46",
          },
          saffron: {
            50: "#fffbeb",
            100: "#fef3c7",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Segoe UI", "system-ui", "sans-serif"],
        hindi: ["var(--font-noto-sans-devanagari)", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
