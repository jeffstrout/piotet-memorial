import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: proxy /api to the local Express server so the client and API share an
// origin just like they do in production on DO App Platform.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
