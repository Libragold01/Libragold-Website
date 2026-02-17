import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'V9',
    emptyOutDir: true,
  },
  server: {
    // Redirect all requests to index.html for client-side routing
    historyApiFallback: true,
  },
  preview: {
    // Also for production preview
    historyApiFallback: true,
  },
})
