import { defineNuxtPlugin } from 'nuxt/app';
import { fetch } from '../apis';
import { pluginFetch } from '@/apis/pluginFetch';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(fetch);
  nuxtApp.vueApp.use(pluginFetch);
});
