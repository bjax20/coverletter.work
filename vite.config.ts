import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { wasp } from 'wasp/client/vite'

export default defineConfig({
  plugins: [
    react(),
    wasp(), // 🐝 Required by the modern Wasp compiler to build your app structure
  ],
  server: {
    open: true,
    allowedHosts: [
      '.ngrok-free.dev'
    ]
  },
})