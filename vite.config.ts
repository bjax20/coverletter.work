import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true,
    allowedHosts: [
      '.ngrok-free.dev'
    ]
  },
})
