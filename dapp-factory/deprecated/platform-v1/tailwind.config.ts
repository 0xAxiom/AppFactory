import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0b',
        surface: '#111113',
        elevated: '#1a1a1d',
      },
    },
  },
  plugins: [],
};

export default config;
