import { UseOptions, Lazy, CreateResource } from './resource-mananger';

declare module 'vue/types/vue' {
  interface Vue {
    createResource: CreateResource;
  }
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue> {
    setSuspenseOptions(options: UseOptions): void;
    lazy: Lazy;
  }
}
