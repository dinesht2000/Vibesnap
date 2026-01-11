import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    chunkSizeWarningLimit: 700, // only hides warning (optional)
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
            "firebase/database",
            "firebase/storage"
          ],
          react: ["react", "react-dom"],
        },
      },
    },
  },
})
