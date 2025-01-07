import * as VueDemi from 'vue-demi';
import { createModuleLoader } from './core/moduleLoader';
import { createComponentLoader } from './core/componentLoader';
import { ModuleLoaderSymbol, setActiveLoader, setOptions, addErrorHandler, removeErrorHandler } from './register';
import { createUmdResolver } from './resolvers/umd';

// Types
import type { ModuleLoader, Resolver, ResolverCreatorOptions } from './types';

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

/**
 * create module loader
 */
export function createLoader<Props extends Record<string, any> = any, Context = any>(
  options: {
    /**
     * global variables for the resolver
     */
    globalVariables?: Record<string, any>;
  } & XOR<
    {
      /**
       * remote module resolver, default to umd resolver
       */
      resolver?: Resolver<Context>;
    },
    ResolverCreatorOptions<WindowProxy>
  > = {},
) {
  const { resolver: customResolver, globalVariables, ...resolverOptions } = options;
  const resolver = customResolver ?? (createUmdResolver(resolverOptions) as Resolver<any>);
  resolver.setGlobalVariables({
    ...globalVariables,
    VueDemi,
  });

  const loader: ModuleLoader<Props, Context> = VueDemi.markRaw({
    install(app) {
      // this allows calling registerSubModules() outside of a component setup after
      setActiveLoader(loader);

      if (!VueDemi.isVue2) {
        const moduleLoader = createModuleLoader(app, resolver);
        const componentLoader = createComponentLoader(app, resolver);

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
    resolver: Object.freeze(resolver),
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
