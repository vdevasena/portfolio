import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'pentastyle-ungesticular-carylon.ngrok-free.dev',
      'unipolar-tiffiny-unqualifiable.ngrok-free.dev' // ✅ add your ngrok domain here
    ]
  }
})
