import { createModuleLoader } from './core/moduleLoader';
import { createComponentLoader } from './core/componentLoader';

// Types
import type { Vue2 } from 'vue-demi';

export class ModuleLoaderVuePlugin {
  /**
   * ModuleLoader method
   * @internal
   */
  static _moduleLoader: ReturnType<typeof createModuleLoader>;
  /**
   * ComponentLoader method
   * @internal
   */
  static _componentLoader: ReturnType<typeof createComponentLoader>;

  static install(Vue: typeof Vue2) {
    // Used to avoid multiple mixins being setup
    // when in dev mode and hot module reload
    // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
    if (Vue.$__module_loader_installed__) return;
    // eslint-disable-next-line @typescript-eslint/camelcase
    Vue.$__module_loader_installed__ = true;

    this._moduleLoader = createModuleLoader(Vue);
    const componentLoader = (this._componentLoader = createComponentLoader(Vue));

    /**
     * 注入到 Vue 实例
     */
    Object.defineProperties(Vue.prototype, {
      $componentLoader: {
        value: componentLoader,
        writable: false,
        enumerable: true,
        configurable: true,
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
