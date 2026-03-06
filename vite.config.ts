import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';

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
      '@lib': resolve(__dirname, 'lib'),
    },
  },
  plugins: [
    buildVersionPlugin(),
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'prompt',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /index\.html$/,
            handler: 'NetworkFirst',
          },
          {
            urlPattern:
              /\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
      manifest: {
        name: 'tungsten',
        short_name: 'tungsten',
        start_url: '/',
        display: 'standalone',
        display_override: ['window-controls-overlay'],
        orientation: 'portrait',
        background_color: '#111827',
        theme_color: '#111827',
        icons: [
          {
            src: '/icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-512.png',
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});

function buildVersionPlugin() {
  return {
    name: 'build-version',
    buildStart() {
      const pkg = JSON.parse(
        readFileSync(resolve(__dirname, 'package.json'), 'utf8'),
      );
      const [major, minor] = pkg.version.split('.');

      const counterFile = resolve(__dirname, '.build-count');
      const count = existsSync(counterFile)
        ? parseInt(readFileSync(counterFile, 'utf8').trim(), 10) + 1
        : 1;
      writeFileSync(counterFile, String(count));

      let hash = 'unknown';
      try {
        hash = execSync('git rev-parse --short HEAD').toString().trim();
      } catch {
        /* not a git repo */
      }

      const version = `v${major}.${minor}.${count}.${hash}_unstable`;
      const out = resolve(__dirname, 'lib/version.ts');
      writeFileSync(
        out,
        `// auto-generated — do not edit\nexport const BUILD_VERSION = '${version}';\n`,
      );

      console.log(`\x1b[36m[version]\x1b[0m ${version}`);
    },
  };
}
