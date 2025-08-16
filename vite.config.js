import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Detect if running on Netlify
const isNetlify = process.env.NETLIFY === 'true';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
<<<<<<< HEAD
  base: isNetlify ? '/' : '/Lets-V-Testing/', // Change this to your repo name
=======
  base: '/', // Set base to root for all environments
>>>>>>> 93a1078 (changed some cart and other options)
});
