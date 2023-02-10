import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  ssr: true,
  plugins: [{ src: 'plugins/resource-manager' }],
  build: {
    transpile: ['@vue-async/resource-manager'],
  },
});
