/**
 * Extends interfaces in Vue.js
 */
import Vue, { ComponentOptions } from 'vue';
import { ModuleData } from './ability/moduleLoader';
import ModuleLoader from './framework';

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue, Options = Record<string, any>> {
    $_module_loader_installed?: true;
    options: Options;
  }
}
