import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",      // Needed for Docker to expose the server
    port: 3000,      // Force it to use Port 3000
    watch: {
      usePolling: true // Fixes hot-reload on Windows
    }
  }
})