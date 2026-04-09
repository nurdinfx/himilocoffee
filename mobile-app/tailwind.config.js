/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fcf4f0',
          100: '#fae5db',
          500: '#d74c26',
          600: '#c0361a',
          900: '#692015',
        },
      }
    },
  },
  plugins: [],
}

