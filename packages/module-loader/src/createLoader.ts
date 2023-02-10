import { isVue2, App, markRaw } from 'vue-demi';
// import { createModuleLoader } from './core/moduleLoader';
import { createComponentLoader } from './core/componentLoader';
import { createEventBus } from './core/eventBus';
import { createInject } from './inject';
import { InjectSymbol, ComponentLoaderSymbole, EventBusSymbole } from './shared/context';
import { ModuleLoader } from './types';

export function createLoader() {
  const moduleLoader: ModuleLoader = markRaw({
    install: (app: App) => {
      const inject = createInject({});
      // const moduleLoader = createModuleLoader(app);
      const componentLoader = createComponentLoader(app);
      const eventBus = createEventBus();
      if (!isVue2) {
        app.provide(InjectSymbol, inject);
        app.provide(ComponentLoaderSymbole, componentLoader);
        app.provide(EventBusSymbole, eventBus);
        app.config.globalProperties.$inject = inject;
        app.config.globalProperties.$componentLoader = componentLoader;
        app.config.globalProperties.$eventBus = eventBus;

        // @ts-ignore
        console.log(app);

        const _mount = app.mount;
        app.mount = function (...args: Parameters<typeof app.mount>) {
          if(this.config.globalProperties.$router){

          }
          return _mount.apply(this, args);
        };
      }
    },
  });
  return moduleLoader;
}
