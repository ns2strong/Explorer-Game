import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `base: './'` lets the built game run from any folder, including GitHub Pages.
// `vite build --mode single` produces one self-contained HTML file (fonts and code inlined)
// that can be shared or opened directly.
// A readable build stamp shown in Grown-up Settings, so you can tell which version a device has.
const BUILD = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';

export default defineConfig(({ mode }) => ({
  base: './',
  define: { __APP_BUILD__: JSON.stringify(BUILD) },
  plugins: mode === 'single' ? [react(), viteSingleFile()] : [react()],
  build:
    mode === 'single'
      ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000, cssCodeSplit: false }
      : undefined,
}));
