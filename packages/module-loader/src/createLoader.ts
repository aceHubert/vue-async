import { isVue2, markRaw } from 'vue-demi';
import { createModuleLoader } from './core/moduleLoader';
import { createComponentLoader } from './core/componentLoader';
import {
  ModuleLoaderSymbol,
  setActiveLoader,
  setModuleLoaderOptions,
  addErrorHandler,
  removeErrorHandler,
} from './register';

// Types
import type { ModuleLoader } from './types';

export function createLoader() {
  const loader: ModuleLoader = markRaw({
    install(app) {
      // this allows calling registerSubModules() outside of a component setup after
      setActiveLoader(loader);

      if (!isVue2) {
        const moduleLoader = createModuleLoader(app);
        const componentLoader = createComponentLoader(app);

        loader._a = app;
        loader._moduleLoader = moduleLoader;
        app.config.globalProperties.$componentLoader = loader._componentLoader = componentLoader;
        app.provide(ModuleLoaderSymbol, loader);
      }
    },
    setOptions(options) {
      setModuleLoaderOptions.call(null, options);
      return this;
    },
    addErrorHandler(handler) {
      addErrorHandler.call(null, handler);
      return this;
    },
    removeErrorHandler(handler) {
      removeErrorHandler.call(null, handler);
      return this;
    },
    // it's actually undefined here
    // @ts-expect-error set in install when using Vue 3
    _a: null,
  });

  return loader;
}
