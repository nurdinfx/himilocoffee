/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fcf4f0',
          100: '#fae5db',
          200: '#f3c7b3',
          300: '#ea9f82',
          400: '#e0714e',
          500: '#d74c26',
          600: '#c0361a',
          700: '#a02816',
          800: '#832416',
          900: '#692015',
        },
      }
    },
  },
  plugins: [],
}
