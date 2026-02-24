import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // MV3 CSP blocks <link rel="modulepreload"> in extension pages.
    // Do not remove without testing in a loaded extension.
    modulePreload: false,
    rollupOptions: {
      input: {
        devtools: resolve(__dirname, 'devtools.html'),
        sidebar: resolve(__dirname, 'sidebar.html'),
      },
    },
  },
})
