// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import pwa from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [
    react(),
    pwa({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'sounds/*.mp3'],
      manifest: {
        name: 'Flowmodoro',
        short_name: 'Flowmodoro',
        description: 'Intelligent Focus Timer',
        theme_color: '#f8f9fc',
        background_color: '#f8f9fc',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,mp3}'],
        navigateFallback: '/',
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
