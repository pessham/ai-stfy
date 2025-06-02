import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/main-bundle-v4-[hash].js`,
        chunkFileNames: `assets/vendor-chunk-v4-[hash].js`,
        assetFileNames: `assets/static-asset-v4-[hash].[ext]`
      }
    }
  },
});
