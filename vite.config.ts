import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

const root = resolve(__dirname, 'src');

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@images': resolve(root, 'assets/images'),
      '@styles': resolve(root, 'assets/styles'),
      '@assets': resolve(root, 'assets'),
      '@core': resolve(root, 'components/core'),
      '@components': resolve(root, 'components'),
      '@services': resolve(root, 'services'),
      '@layouts': resolve(root, 'layouts'),
      '@pages': resolve(root, 'pages'),
      '@hooks': resolve(root, 'hooks'),
      '@models': resolve(root, 'models'),
      '@stores': resolve(root, 'stores'),
      '@utils': resolve(root, 'utils'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: 'tungsten',
        short_name: 'tungsten',
        start_url: '/',
        display: 'standalone',
        background_color: '#111827',
        theme_color: '#111827',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    cssCodeSplit: false,
    modulePreload: true,
  },
});
