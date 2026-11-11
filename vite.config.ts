/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Never inline images into the JavaScript as base64: the character frames are small PNGs that
    // would all ride in the first download. As files, each one loads only when it is drawn.
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'node',
  },
})
