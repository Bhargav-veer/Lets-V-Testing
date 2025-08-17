import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Automatically set base for local/dev and GitHub Pages prod
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  // Use '/' for local development, '/Lets-V-Testing/' only for production (GitHub Pages)
  base: isProduction ? '/Lets-V-Testing/' : '/',
});
