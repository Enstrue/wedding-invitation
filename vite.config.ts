import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/wedding-invitation/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    open: false,
  },
});
