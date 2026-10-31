import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `base: './'` lets the built game run from any folder, including GitHub Pages.
// `vite build --mode single` produces one self-contained HTML file (fonts and code inlined)
// that can be shared or opened directly.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'single' ? [react(), viteSingleFile()] : [react()],
  build:
    mode === 'single'
      ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000, cssCodeSplit: false }
      : undefined,
}));
