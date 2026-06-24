import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Only apply base for production builds (GitHub Pages).
  // Dev server stays at '/' so all /public assets resolve normally.
  base: process.env.NODE_ENV === 'production' ? '/KARUSDA-page/' : '/',
})