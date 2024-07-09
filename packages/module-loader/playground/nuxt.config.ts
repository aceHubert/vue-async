import { fileURLToPath, URL } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      script: [{ src: 'https://cdn.jsdelivr.net/npm/js-loading-overlay@1.2.0/dist/js-loading-overlay.min.js' }],
    },
  },
  // plugins: [{ src: 'plugins/module-loader' }],
  build: {
    transpile: ['@vue-async/*'],
  },
  alias: {
    '@vue-async/module-loader': fileURLToPath(new URL('../src', import.meta.url)),
  },
});
