import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),VitePWA({ 
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
    manifest: {
      name: 'AI Art',
      short_name: 'AI Art',
      theme_color: '#000',
      icons: [
          {
              src: '512icon.png',
              sizes: '64x64',
              type: 'image/png'
          },
          {
              src: '512icon.png',
              sizes: '192x192',
              type: 'image/png'
          },
          {
              src: '512icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
          },
          {
              src: '512icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
          }
      ],
    }, 
  })],
})
