import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor_react: ['react', 'react-dom'],
          vendor_three: ['three', '@react-three/fiber', '@react-three/postprocessing'],
          vendor_gsap: ['gsap', '@gsap/react'],
          vendor_motion: ['framer-motion'],
          vendor_ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', 'lucide-react']
        }
      }
    }
  }
});
