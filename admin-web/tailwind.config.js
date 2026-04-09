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
          50: '#fdf3f0',
          100: '#fae3dc',
          200: '#f4c3b3',
          300: '#eb9b83',
          400: '#e06b52',
          500: '#d5432b',
          600: '#be3121',
          700: '#9f251c',
          800: '#83211a',
          900: '#6d1f19',
        },
      }
    },
  },
  plugins: [],
}
