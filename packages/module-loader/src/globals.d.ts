/**
 * Extends interfaces in Vue.js
 */
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue, Options = Record<string, any>> {
    $__module_loader_installed__?: true;
    options: Options;
  }
}
