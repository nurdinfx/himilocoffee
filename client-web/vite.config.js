import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    // Hard-bake the production API URL at build time - no env var needed on Vercel
    '__API_BASE__': JSON.stringify('https://himilocoffee.onrender.com')
  },
  plugins: [
    react()
  ],
})
