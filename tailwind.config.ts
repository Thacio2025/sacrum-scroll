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
        batina: "#050505",
        liturgico: "#d4af37",
        pedra: "#a1a1aa",
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "Cinzel", "serif"],
        "cinzel-decorative": ["var(--font-cinzel-decorative)", "Cinzel Decorative", "serif"],
        cormorant: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        garamond: ["var(--font-garamond)", "EB Garamond", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
