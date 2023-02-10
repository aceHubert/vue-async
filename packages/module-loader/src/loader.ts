import warning from 'warning';
import { debug } from './env';
import { subModuleConfigs, moduleLoaderOptions, loaderLifecycles, errorHanlders } from './register';

// Types

import { Router, RouteRecordRaw } from 'vue-router';
import { Store, Module, ModuleOptions } from 'vuex';
import { createModuleLoader } from './core/moduleLoader';
import { RegisterSubModule } from './register';
import { InjectFunction } from './types';

export const registerLoader = (
  moduleLoader: ReturnType<typeof createModuleLoader>,
  {
    router,
    store,
    inject,
  }: {
    router?: Router;
    store?: Store<any>;
    inject?: InjectFunction;
  },
) => {
  // 加载模块
  const loader = async (needAcivateSubModules: RegisterSubModule[]) => {
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
          ((routes: RouteRecordRaw[]): void | (() => void) => {
            if (router) {
              routes.forEach((route) => {
                router.addRoute(route);
              });

              return () => {
                // @ts-ignore not working on vue-router 3.x
                if (router.removeRoute) {
                  routes.forEach((route) => {
                    route.name
                      ? router.removeRoute(route.name)
                      : warning(!debug, `"router.removeRoute" only works with named route record!`);
                  });
                } else {
                  // TODO: remove routes
                  // addRoutes 重复添加会被替换暂没有问题，暂时卸载不了
                  warning(!debug, '"removeRoute" function is not working, or you can customize it from parameter!');
                }
              };
            }
            // 如果未设置 vue-router
            warning(!debug && !!router, 'please set "addRoutes" parameter!');
          }),
        registerStore:
          moduleLoaderOptions.registerStore ||
          ((path: string, module: Module<any, any>, options?: ModuleOptions): void | (() => void) => {
            if (store) {
              store.registerModule(path, module, options);
              return () => store.unregisterModule(path);
            }
            // 如果未使用 vuex
            warning(!debug && !!store, 'please set "registerStore" parameter!');
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
            if (inject) {
              inject(tag, functionToAdd, priority, acceptedArgs);
              return () => {
                inject(tag).remove(functionToAdd, priority);
              };
            }

            // 如果未使用 inject
            warning(!debug && !!inject, 'please set "registerInject" parameter!');
          }),
      },
    );
    // hide loading
    stopLoading && stopLoading();
  };

  // 卸载模块
  const unloader = async (needUnactivateSubModules: RegisterSubModule[]) => {
    // show loading
    const stopLoading = moduleLoaderOptions.loading?.('unmount');
    // 执行模块 unmount
    await Promise.all(needUnactivateSubModules.map((module) => module.unmount!()));
    // hide loading
    stopLoading && stopLoading();
  };

  // 使用 vue-router
  if (router) {
    //@ts-ignore options.base in vue-router 3.x, options.history.base in vue-router 4.x
    const routerBase = router.options.base || router.options.history.base;

    const matchRoute = (activeRules: RegisterSubModule['activeRule']): boolean =>
      activeRules.some((rule) => rule(window.location, routerBase));

    router.beforeEach(async (to, from, next) => {
      const needAcivateSubModules = subModuleConfigs.filter(
        ({ activeRule, activated }) => activated !== true && matchRoute(activeRule),
      );

      await loader(needAcivateSubModules);

      next();
    });

    router.afterEach(async (to, from) => {
      const needUnactivateSubModules = subModuleConfigs.filter(
        ({ activeRule, activated, unmount }) => activated === true && !!unmount && !matchRoute(activeRule),
      );
      await unloader(needUnactivateSubModules);
    });
  } else {
    // 使用 window.location
    const matchRoute = (activeRules: RegisterSubModule['activeRule']): boolean =>
      activeRules.some((rule) => rule(window.location, '/'));

    const popStateHandler = async () => {
      const needAcivateSubModules = subModuleConfigs.filter(
        ({ activeRule, activated }) => activated !== true && matchRoute(activeRule),
      );

      await loader(needAcivateSubModules);
    };

    const beforeUnloadListener = async () => {
      const needUnactivateSubModules = subModuleConfigs.filter(
        ({ activeRule, activated, unmount }) => activated === true && !!unmount && !matchRoute(activeRule),
      );
      await unloader(needUnactivateSubModules);
    };

    window.addEventListener('popstate', popStateHandler);
    window.addEventListener('beforeunload', beforeUnloadListener);
  }
};
