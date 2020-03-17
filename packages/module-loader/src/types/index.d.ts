import _VUE, { Component as VueComponent } from 'vue';
import { RouteConfig } from 'vue-router';
import { ModuleData } from '../ability/moduleLoader';

declare const ModuleLoader: ModuleLoader;
export default ModuleLoader;
export interface ModuleLoader {
  framework: Framework;
  // version: string
  new (options: { modules: ModuleData[] }): ModuleLoader;
}

export interface Framework {
  loaded: boolean;
  layouts: {
    [layoutName: string]: VueComponent;
  };
  addRouters: (routes: RouteConfig[]) => void;
  addLayouts: (name: string, layout: VueComponent) => void;
}

declare module 'vue/types/vue' {
  interface Vue {
    $moduleLoader: (moduleData: ModuleData | ModuleData[]) => Promise<void>;
    $eventBus: {
      emit: (eventName: string, playload: any) => void;
      on: (eventName: string, handler: (playload: any) => void) => void;
      off: (eventName: string, handler: (playload: any) => void) => void;
      clear: () => void;
      getEvents: () => { [eventName: string]: any };
    };
    $moduleLoaderManager: Framework;
  }
}

declare module 'vue/types/options' {
  export interface ComponentOptions<
    V extends Vue,
    Data = DefaultData<V>,
    Methods = DefaultMethods<V>,
    Computed = DefaultComputed,
    PropsDef = PropsDefinition<DefaultProps>,
    Props = DefaultProps
  > {
    moduleLoader?: ModuleLoader;
  }
}
