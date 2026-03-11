import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://libragold-website.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://libragold-website.onrender.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'Libragold Admin',
  },
});
