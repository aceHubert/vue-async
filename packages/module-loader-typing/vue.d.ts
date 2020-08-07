import { Framework, DynamicComponent } from './module';

declare module 'vue/types/vue' {
  interface Vue {
    // @ts-ignore
    $moduleLoadManager: Framework & Record<string, any>;
    $dynamicComponent: {
      add: (component: DynamicComponent, position?: string) => void;
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
