import build from '@hono/vite-build/cloudflare-workers'
import adapter from '@hono/vite-dev-server/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import honox from 'honox/vite'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [
    honox({
      devServer: { adapter },
      client: { input: ['./app/style.css'] }
    }),
    tailwindcss(),
    build()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app')
    }
  }
})
