import { createResource } from './core/createResource';

// Extensions of Vue types to be appended manually
// https://github.com/microsoft/rushstack/issues/2090
// https://github.com/microsoft/rushstack/issues/1709

// @ts-ignore: works on Vue 2, fails in Vue 3
declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Create a resource
     */
    $createResource: typeof createResource;
  }
}

// @ts-ignore: works on Vue 3, fails in Vue 2
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * Create a resource
     */
    $createResource: typeof createResource;
  }
}
