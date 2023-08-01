import warning from 'warning';
import { Vue2 } from 'vue-demi';
import { createEventBus } from '@ace-util/core';
import { createModuleLoader } from './core/moduleLoader';
import { createComponentLoader } from './core/componentLoader';
import { debug } from './env';
import {
  moduleLoaderOptions,
  subModuleConfigs,
  loaderLifecycles,
  errorHanlders,
  // registerSubModules,
  // setModuleLoaderOptions,
  // addErrorHandler,
} from './register';
import { globalInject } from './inject';

// Types
// @ts-ignore: works on vue-router 3.x, fails in vue-router 4.x
import VueRouter, { RouteConfig } from 'vue-router';
import { Module, ModuleOptions } from 'vuex';
import { RegisterSubModule } from './register';
// import { DeprecatedModuleLoaderOptions, RegistrableModule } from './types';

export function ModuleLoaderVuePlugin(Vue: typeof Vue2) {
  // Used to avoid multiple mixins being setup
  // when in dev mode and hot module reload
  // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
  if (Vue.$__module_loader_installed__) return;
  // eslint-disable-next-line @typescript-eslint/camelcase
  Vue.$__module_loader_installed__ = true;

  const moduleLoader = createModuleLoader(Vue);
  const componentLoader = createComponentLoader(Vue);
  const eventBus = createEventBus();

  /**
   * 注入到 Vue 实例
   */
  Object.defineProperties(Vue.prototype, {
    $moduleLoder: {
      value: () => {
        warning(
          !debug,
          `[@vue-async/module-loader] deprecated and does not work from now on, please use "registerSubModules" function directly before app started!`,
        );
      },
      writable: false,
      enumerable: true,
      configurable: true,
    },
    $componentLoader: {
      value: componentLoader,
      writable: false,
      enumerable: true,
      configurable: true,
    },
    $eventBus: {
      value: eventBus,
      writable: false,
      enumerable: true,
      configurable: true,
    },
  });

  // 扩展 new ModuleLoader().load() 在 Vue 实例化之前加载模块
  // Object.defineProperties(this.prototype, {
  //   load: {
  //     value: (
  //       modules: RegistrableModule | RegistrableModule[],
  //       { sync, onLoading, onLoaded, onError }: DeprecatedModuleLoaderOptions,
  //     ) => {
  //       warning(
  //         !debug,
  //         `[@vue-async/module-loader] deprecated and will remove in future, please use "registerSubModules" function directly!`,
  //       );
  //       registerSubModules(modules, {
  //         beforeMount: onLoading ? (config) => onLoading(config.name) : undefined,
  //         afterMount: onLoaded ? (config) => onLoaded(config.name) : undefined,
  //       });
  //       setModuleLoaderOptions({ sync });
  //       onError && addErrorHandler((error, config) => onError(config.name, error));
  //     },
  //     writable: false,
  //     enumerable: true,
  //     configurable: true,
  //   },
  //   loadComponent: {
  //     value: componentLoader,
  //     writable: false,
  //     enumerable: true,
  //     configurable: true,
  //   },
  //   eventBus: {
  //     value: eventBus,
  //     writable: false,
  //     enumerable: true,
  //     configurable: true,
  //   },
  // });

  /**
   * router注入
   * @param router
   */
  // @ts-ignore: works on Vue 2, fails in Vue 3
  const routerInject = (router: VueRouter) => {
    const matchRoute = (activeRules: RegisterSubModule['activeRule'], base: string): boolean =>
      activeRules.some((rule) => rule(window.location, base));

    // @ts-ignore: type error
    router.beforeEach(async (to, from, next) => {
      const needAcivateSubModules = subModuleConfigs.filter(
        ({ activeRule, activated }) => activated !== true && matchRoute(activeRule, router.options.base),
      );
      // show loading
      const stopLoading = moduleLoaderOptions.loading?.('mount');
      // 执行已经加载的模块 mount
      await Promise.all(needAcivateSubModules.filter((module) => !!module.mount).map((module) => module.mount!()));
      // 执行未加载的模块
      await moduleLoader(
        needAcivateSubModules.filter((module) => !module.mount),
        {
          sync: moduleLoaderOptions.sync,
          lifecycles: loaderLifecycles,
          errorHanlders,
          addRoutes:
            moduleLoaderOptions.addRoutes ||
            ((routes: RouteConfig[]): void | (() => void) => {
              router.addRoutes(routes);
              return () => {
                // TODO: remove routes
                // addRoutes 重复添加会被替换暂没有问题，暂时卸载不了
                warning(!debug, '"removeRoutes" function is not working, or you can set it by yourself!');
              };
            }),
          registerStore:
            moduleLoaderOptions.registerStore ||
            ((path: string, module: Module<any, any>, options?: ModuleOptions): void | (() => void) => {
              const store = router.app?.$store;

              if (store) {
                store.registerModule(path, module, options);
                return () => store.unregisterModule(path);
              }
              // 如果未使用 Vuex
              warning(!debug && !!store, 'please set "registerStore" function!');
            }),
          registerInject:
            moduleLoaderOptions.registerInject ||
            ((
              tag: string,
              functionToAdd: Function,
              {
                priority = 10,
                acceptedArgs = 1,
              }: {
                priority?: number;
                acceptedArgs?: number;
              } = {},
            ): void | (() => void) => {
              globalInject(tag, functionToAdd, priority, acceptedArgs);
              return () => {
                globalInject(tag).remove(functionToAdd, priority);
              };
            }),
        },
      );
      // hide loading
      stopLoading && stopLoading();

      next();
    });

    // @ts-ignore: type error
    router.afterEach(async (to, from) => {
      const needUnmountSubModules = subModuleConfigs.filter(
        ({ activeRule, activated, unmount }) =>
          activated === true && !!unmount && !matchRoute(activeRule, router.options.base),
      );
      // show loading
      const stopLoading = moduleLoaderOptions.loading?.('unmount');
      // 执行模块 unmount
      await Promise.all(needUnmountSubModules.map((module) => module.unmount!()));
      // hide loading
      stopLoading && stopLoading();
    });
  };

  const _init = Vue.prototype._init;
  /**
   * 从 Vue root.options 中获取 router | store 实例
   */
  Vue.prototype._init = function (options: any = {}) {
    // router beforeEach 需要在 beforeCreate 之前添加，才能在页面强制刷新时第一次生效
    if (options.router) {
      routerInject(options.router);
    }

    _init.call(this, options);
  };
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
