import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        "name": "Mgiftana Carwash & Lounge",
        "short_name": "Mgiftana's",
        "description": "Premium Lounge and Luxury Car Detailing Boutique PWA.",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#000000",
        "theme_color": "#F59E0B",
        "icons": [
          {
            "src": "https://res.cloudinary.com/dvvugpu04/image/upload/v1785159774/Mgiftnana_logo_uvjolg.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "https://res.cloudinary.com/dvvugpu04/image/upload/v1785159774/Mgiftnana_logo_uvjolg.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg}']
      }
    })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
