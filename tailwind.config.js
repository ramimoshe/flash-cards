/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
        },
        secondary: {
          DEFAULT: '#0ea5e9',
          dark: '#0284c7',
        },
        accent: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        cefr: {
          a1: '#22c55e',
          a2: '#84cc16',
          b1: '#eab308',
          b2: '#f97316',
          c1: '#ef4444',
          c2: '#dc2626',
          unknown: '#6b7280',
        },
      },
    },
  },
  plugins: [],
};
