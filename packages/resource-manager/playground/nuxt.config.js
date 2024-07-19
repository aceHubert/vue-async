import { fileURLToPath, URL } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: true,
  // plugins: [{ src: 'plugins/resource-manager' }],
  build: {
    transpile: ['@vue-async/*'],
  },
  alias: {
    '@vue-async/resource-manager': fileURLToPath(new URL('../src', import.meta.url)),
  },
});
