import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Detect if running on Netlify
const isNetlify = process.env.NETLIFY === 'true';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  base: isNetlify ? '/' : '/Lets-V-Testing/', // Change this to your repo name
});
