import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  server: {
    open: true,
    allowedHosts: [
      '.ngrok-free.dev'
    ]
  },
})