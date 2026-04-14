import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  define: {
    // Hard-bake the production API URL at build time - no env var needed on Vercel
    '__API_BASE__': JSON.stringify('https://himilocoffee.onrender.com')
  },
  plugins: [
    react(),
    VitePWA({
      selfDestroying: true,
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: false,
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      },
      includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png', 'auth-bg.png']
    })
  ],
})
