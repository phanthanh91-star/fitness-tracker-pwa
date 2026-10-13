import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Cấu hình Vite cho ứng dụng PWA
// base: '/fitness-tracker-pwa/' khi build production (GitHub Pages)
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/fitness-tracker-pwa/' : '/',
  server: {
    port: 3000,
    host: true
  }
}));
