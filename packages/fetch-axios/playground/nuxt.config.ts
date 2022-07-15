import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  ssr: false,
  plugins: ['@/plugins/fetch'],
  build: {
    transpile: ['@vue-async/fetch'],
  },
});
