import { ResourceManager, CreateResource, Lazy } from './types';

// Extensions of Vue types to be appended manually
// https://github.com/microsoft/rushstack/issues/2090
// https://github.com/microsoft/rushstack/issues/1709

// @ts-ignore: works on Vue 2, fails in Vue 3
declare module 'vue/types/vue' {
  interface Vue {
    createResource: CreateResource;
  }

  interface VueConstructor<V extends Vue = Vue> {
    lazy: Lazy;
  }
}

// @ts-ignore: works on Vue 3, fails in Vue 2
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $aresource: ResourceManager;
  }
}
