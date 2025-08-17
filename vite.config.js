import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use an env variable to switch between Netlify and GitHub Pages
const deployTarget = process.env.VITE_DEPLOY_TARGET;

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  base: deployTarget === 'gh-pages' ? '/Lets-V-Testing/' : '/',  // ✅ Default '/' for Netlify
});
