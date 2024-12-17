// Types
import type { ModuleLoader } from './types';

// Extensions of Vue types to be appended manually
// https://github.com/microsoft/rushstack/issues/2090
// https://github.com/microsoft/rushstack/issues/1709

// @ts-ignore: works on Vue 2, fails in Vue 3
declare module 'vue/types/vue' {
  interface Vue {
    /**
     * module loader instance
     */
    $moduleLoader: ModuleLoader;
  }
}

// @ts-ignore: works on Vue 2, fails in Vue 3
declare module 'vue/types/options' {
  interface ComponentOptions<V> {
    /**
     * module loader  instance to install in your application. Should be passed to the
     * root Vue.
     */
    moduleLoader?: ModuleLoader;
  }
}

// @ts-ignore: works on Vue 3, fails in Vue 2
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * module loader instance
     */
    $moduleLoader: ModuleLoader;
  }
}
