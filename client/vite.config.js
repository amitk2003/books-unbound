import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Your backend URL
        changeOrigin: true,               // Changes host header to match target
        secure: false,                    // For localhost
        rewrite: (path) => path.replace(/^\/api/, '/api'),  // Keep /api prefix if your routes expect it
      },
    },
  },
 
})
