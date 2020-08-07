/**
 * Extends interfaces in Vue.js
 */
import Vue, { VueConstructor } from 'vue';

declare global {
  interface Window {
    Vue: VueConstructor;
    [moduleName: string]: any;
  }

  export type ValueOf<T> = T[keyof T];
  export type Dictionary<T> = Record<string, T>;
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue, Options = Dictionary<any>> {
    $__module_loader_installed__?: true;
    options: Options;
  }
}
