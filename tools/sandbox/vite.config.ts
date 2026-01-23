import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false, // Disabled - use VS Code Simple Browser instead
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Serve assets from repo root for GLB/thumbnail fallback
  publicDir: 'public',
});
