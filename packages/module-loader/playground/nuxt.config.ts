import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  ssr: false,
  head: {
    scripts: [{ src: 'https://cdn.jsdelivr.net/npm/js-loading-overlay@1.2.0/dist/js-loading-overlay.min.js' }],
  },
  components: {
    global: false,
  },
  plugins: [{ src: '@/plugins/module-loader' }],
  build: {
    transpile: ['@vue-async/utils', '@vue-async/module-loader'],
  },
});
