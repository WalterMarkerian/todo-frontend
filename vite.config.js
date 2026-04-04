import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Definimos la ruta base para que los assets carguen correctamente tras el proxy
  base: '/todo/', 
  server: {
    port: 5173, // Puerto por defecto para desarrollo local en Windows
    strictPort: true,
  }
})