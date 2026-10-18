import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static site. Content is imported from src/data at build time; there is no API.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
