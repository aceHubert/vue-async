import { defineNuxtPlugin } from 'nuxt/app';
import { createResourceManager } from '@vue-async/resource-manager';

export default defineNuxtPlugin({
  name: 'resource-manager',
  enforce: 'pre',
  async setup(nuxtApp) {
    const resourceManager = createResourceManager();
    nuxtApp.vueApp.use(resourceManager);
  },
});
