import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages serves this repo at /AthaniQ-Kolhapuri/. Override with VITE_BASE if the repo is renamed or a custom domain is used.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/AthaniQ-Kolhapuri/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
})
