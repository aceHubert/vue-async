/**
 * Extends interfaces in Vue.js
 */
import Vue, { VueConstructor } from 'vue';

declare global {
  interface Window {
    Vue: VueConstructor;
  }
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue, Options = Record<string, any>> {
    $__module_loader_installed__?: true;
    options: Options;
  }
}
