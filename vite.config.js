import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './static',
  base: '/',
  build: {
    outDir: '../static/dist',
    assetsDir: '',
    manifest: true,
    rollupOptions: {
      input: './static/js/main.jsx',
      output: {
        entryFileNames: 'js/bundle.js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
