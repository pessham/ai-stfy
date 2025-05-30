import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ai-stfy/',
  server: {
    port: 3000,
    strictPort: false,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: '/ai-stfy/assets/[name]-[hash][extname]',
        chunkFileNames: '/ai-stfy/assets/[name]-[hash].js',
        entryFileNames: '/ai-stfy/assets/[name]-[hash].js'
      }
    }
  }
})
