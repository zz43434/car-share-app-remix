import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'media',
  theme: {
    darkMode: 'media',
    extend: {},
  },
  plugins: [],
} satisfies Config;
