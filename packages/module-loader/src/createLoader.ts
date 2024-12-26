import * as VueDemi from 'vue-demi';
import { createModuleLoader } from './core/moduleLoader';
import { createComponentLoader } from './core/componentLoader';
import { ModuleLoaderSymbol, setActiveLoader, setOptions, addErrorHandler, removeErrorHandler } from './register';
import { getUmdResolver } from './resolvers/umd';

// Types
import type { ModuleLoader, GetResolver } from './types';

/**
 * create module loader
 */
export function createLoader<Props extends Record<string, any> = any, Context = any>(
  options: {
    /**
     * remote module resolver, default to umd resolver
     */
    resolver?: GetResolver<Context>;
    /**
     * container to append script, default is append to body in client side
     */
    container?: string | ((proxy: Context) => Element);
    /**
     * global variables to expose to remote module
     */
    globals?: Record<string, any>;
  } = {},
) {
  const _resolver = options.resolver?.(options.container) ?? (getUmdResolver(options.container as any) as any);

  // Set global variables
  const proxy = _resolver.context;
  if (!proxy.VueDemi) {
    proxy.VueDemi = VueDemi;
  }
  if (options.globals) {
    Object.assign(proxy, options.globals);
  }

  const loader: ModuleLoader<Props, Context> = VueDemi.markRaw({
    install(app) {
      // this allows calling registerSubModules() outside of a component setup after
      setActiveLoader(loader);

      if (!VueDemi.isVue2) {
        const moduleLoader = createModuleLoader(app, _resolver);
        const componentLoader = createComponentLoader(app, _resolver);

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
