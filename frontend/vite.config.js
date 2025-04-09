import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    PORTA: 3000,
    proxy: {
      '/api': `http://localhost:${PORTA}`,
    },
},
})
