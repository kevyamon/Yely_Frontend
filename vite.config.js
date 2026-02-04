import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Autorise l'accès sur le réseau local
    port: 5173,
    strictPort: true, // Évite que Vite change de port si le 5173 est pris
  }
})