import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: false,
    alias: {
      'framer-motion': fileURLToPath(
        new URL('./src/test/mocks/framer-motion.tsx', import.meta.url),
      ),
    },
  },
})
