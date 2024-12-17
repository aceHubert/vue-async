import { isVue2, markRaw } from 'vue-demi';
import { createModuleLoader } from './core/moduleLoader';
import { createComponentLoader } from './core/componentLoader';
import { ModuleLoaderSymbol, setActiveLoader, setOptions, addErrorHandler, removeErrorHandler } from './register';
import { getUmdResolver } from './resolvers/umd';

// Types
import type { ModuleLoader, GetResolver } from './types';

/**
 * create module loader
 * @param resolver remote module resolver, default to umd resolver
 */
export function createLoader<Context = any>(
  resolver?: GetResolver<Context>,
  container?: string | ((proxy: Context) => Element),
) {
  const _resolver = resolver?.(container) ?? getUmdResolver(container as any);
  const loader: ModuleLoader = markRaw({
    install(app) {
      // this allows calling registerSubModules() outside of a component setup after
      setActiveLoader(loader);

      if (!isVue2) {
        const moduleLoader = createModuleLoader(app, _resolver);
        const componentLoader = createComponentLoader(_resolver);

        loader._a = app;
        loader._moduleLoader = moduleLoader;
        loader._componentLoader = componentLoader;
        app.config.globalProperties.$moduleLoader = loader;
        app.provide(ModuleLoaderSymbol, loader);
      }
    },
    setOptions(options) {
      setOptions.call(null, options);
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
    resolver: Object.freeze(_resolver),
    // it's actually undefined here
    // @ts-expect-error set in install when using Vue 3
    _a: null,
    // @ts-expect-error set in install when using Vue 3
    _moduleLoader: null,
    // @ts-expect-error set in install when using Vue 3
    _componentLoader: null,
  });

  return loader;
}
