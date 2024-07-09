import { createModuleLoader } from './core/moduleLoader';
import { createComponentLoader } from './core/componentLoader';
import { ModuleLoaderSymbol, setActiveLoader } from './register';

// Types
import type { Vue2 } from 'vue-demi';
import type { ModuleLoader } from './types';

export class ModuleLoaderVuePlugin {
  static install(Vue: typeof Vue2) {
    // Used to avoid multiple mixins being setup
    // when in dev mode and hot module reload
    // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
    if (Vue.$__module_loader_installed__) return;
    // eslint-disable-next-line @typescript-eslint/camelcase
    Vue.$__module_loader_installed__ = true;

    // Equivalent of
    // app.config.globalProperties.$moduleLoader = moduleLoader
    Vue.mixin({
      beforeCreate() {
        const options = this.$options;
        if (options.moduleLoader) {
          const loader = options.moduleLoader as ModuleLoader;
          // HACK: taken from provide(): https://github.com/vuejs/composition-api/blob/main/src/apis/inject.ts#L31
          if (!(this as any)._provided) {
            const provideCache = {};
            Object.defineProperty(this, '_provided', {
              get: () => provideCache,
              set: (v) => Object.assign(provideCache, v),
            });
          }
          (this as any)._provided[ModuleLoaderSymbol as any] = loader;

          // propagate the loader instance in an SSR friendly way
          // avoid adding it to nuxt twice
          if (!this.$moduleLoader) {
            this.$moduleLoader = loader;
          }

          // this allows calling registerSubModules() outside of a component setup after
          setActiveLoader(loader);

          const moduleLoader = createModuleLoader(Vue, loader.resolver);
          const componentLoader = createComponentLoader(Vue, loader.resolver);

          loader._a = this as any;
          loader._moduleLoader = moduleLoader;
          loader._componentLoader = componentLoader;
        } else {
          this.$moduleLoader = (options.parent && options.parent.$moduleLoader) || this;
        }
      },
    });
  }
}

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ModuleLoaderVuePlugin);
}

// @internal
declare global {
  interface Window {
    Vue: typeof Vue2;
  }
}
