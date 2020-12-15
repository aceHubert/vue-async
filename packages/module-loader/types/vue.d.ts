/**
 * Augment the typings of Vue.js
 */

import Vue from 'vue';
import { ModuleLoader, ModuleContext } from './module';

declare module 'vue/types/vue' {
  interface Vue extends ModuleContext {
    $moduleLoadManager: ModuleLoader['framework'];
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    moduleLoader?: ModuleLoader;
  }
}
