/**
 * Augment the typings of Vue.js
 */

import Vue from 'vue';
import { ModuleLoader, Modules, ModuleLoaderOption, ModuleContext } from './module';

declare module 'vue/types/vue' {
  interface Vue extends ModuleContext {
    $moduleLoader: (moduleConfig: Modules, opts?: ModuleLoaderOption) => Promise<void>;
    $moduleLoadManager: ModuleLoader['framework'];
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    moduleLoader?: ModuleLoader;
  }
}
