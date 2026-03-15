import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function manifestVersion(): Plugin {
  return {
    name: 'manifest-version',
    generateBundle(_, bundle) {
      const asset = bundle['manifest.json'];
      if (!asset || asset.type !== 'asset') return;

      const { version } = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
      const manifest = JSON.parse(asset.source as string);
      manifest.version = version;
      asset.source = JSON.stringify(manifest, null, 2) + '\n';
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), manifestVersion()],
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
});
