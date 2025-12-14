import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

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
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    minify: 'terser',
    cssCodeSplit: false,
    modulePreload: true,
  },
});
