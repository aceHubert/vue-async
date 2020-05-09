/**
 * Augment the typings of Vue.js
 */

import Vue from 'vue';
import { Framework, ModuleLoader, Modules, DynamicComponent } from './module';

declare module 'vue/types/vue' {
  interface Vue {
    $moduleLoader: (moduleData: Modules) => Promise<void>;
    $moduleLoadManager: Framework;
    $dynamicComponent: {
      add: (component: DynamicComponent, position?: string) => void;
      remove: (name: string, position?: string) => void;
    };
    $eventBus: {
      emit: (eventName: string, playload: any) => void;
      on: (eventName: string, handler: (playload: any) => void) => void;
      off: (eventName: string, handler: (playload: any) => void) => void;
      clear: () => void;
      getEvents: () => { [eventName: string]: any };
    };
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    moduleLoader?: ModuleLoader;
  }
}
