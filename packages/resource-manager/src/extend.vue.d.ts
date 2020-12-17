import Vue, { VNode } from 'vue';
import { UseOptions, AsyncFactory, SuspenseComponent } from 'types/resource-mananger';

declare module 'vue/types/vue' {
  interface Vue {
    asyncFactorys: Set<AsyncFactory<any, SuspenseComponent>>;
    resolved: boolean;
    _e(): VNode;
    _uid: number;
    _render(createElement: typeof Vue.prototype.$createElement): VNode;
    promiser: Promise<any>;
    displayLoading: boolean;
    readonly delay: number;
    setupLoading(): void;
    _self: Vue;
    [key: string]: any;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    suspense?: UseOptions;
  }
}
