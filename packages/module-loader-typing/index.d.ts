import { Component as VueComponent, AsyncComponent } from 'vue';
import { Framework, ModuleLoaderOptions } from './module';

declare module 'vue/types/vue' {
  interface Vue {
    $moduleLoadManager: Framework & ModuleLoaderOptions;
    $dynamicComponent: {
      add: (
        component: VueComponent | AsyncComponent | ({ component: VueComponent | AsyncComponent } & Record<string, any>),
        position?: string,
      ) => void;
      remove: (name: string, position?: string) => void;
    };
    $eventBus: {
      emit: (eventName: string, playload: any) => void;
      on: (eventName: string, handler: (playload: any) => void) => void;
      off: (eventName: string, handler: (playload: any) => void) => void;
      clear: () => void;
      getEvents: () => Record<string, any>;
    };
  }
}
