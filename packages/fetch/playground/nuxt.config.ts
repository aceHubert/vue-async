import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  ssr: false,
  server: {
    host: '0.0.0.0',
    // not working, https://github.com/nuxt/framework/issues/895
    port: 7001,
  },
  plugins: ['@/plugins/fetch'],
  build: {
    transpile: ['@vue-async/fetch'],
  },
});
