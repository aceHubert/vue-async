import { Framework, ModuleContext } from './module';

declare module 'vue/types/vue' {
  interface Vue extends ModuleContext {
    $moduleLoadManager: Framework & Record<string, any>;
  }
}
