import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#0A0A0A",
        blackdeep: "#050505",
        panel: "#151515",
        panellight: "#1E1E1E",
        ink: "#F5F5F0",
        inksoft: "#B8B8AD",
        inkdim: "#6E6E64",
        acid: "#D4FF3D",
        pink: "#FF2E93",
        orange: "#FF6B2C",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
      },
      boxShadow: {
        hard: "4px 4px 0 #000000",
        "hard-lg": "8px 8px 0 rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
export default config;
