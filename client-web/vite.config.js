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
      injectRegister: 'inline', // Inline the registration script to avoid 404 for registerSW.js
      manifestFilename: 'manifest.json',
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}']
      },
      includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png', 'auth-bg.png'],
      manifest: {
        name: 'Himilo Coffee',
        short_name: 'Himilo Coffee',
        description: 'Order your favorite coffee and food from Himilo Coffee',
        theme_color: '#8B4513',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
