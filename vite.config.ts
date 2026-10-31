import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` lets the built game run from any folder, including GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
});
