import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Loaded with next/font in app/layout.tsx, exposed as CSS variables.
        sans: ['var(--font-body)', 'ui-rounded', 'system-ui', 'sans-serif'],
        hand: ['var(--font-hand)', 'cursive'],
      },
      colors: {
        paper: '#F9F6F0',  // page background
        card: '#FFFDF8',   // card surface, a touch lighter than the page
        ink: '#292524',    // stone-800 — text, borders, shadows
      },
    },
  },
  plugins: [],
};

export default config;
