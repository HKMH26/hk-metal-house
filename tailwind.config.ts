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
          DEFAULT: "#003366", // Dark Blue
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#4a5568", // Gray
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#e2e8f0", // Light Gray
          foreground: "#1a202c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
