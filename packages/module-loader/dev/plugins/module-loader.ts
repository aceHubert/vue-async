/* eslint-disable no-console */
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import ModuleLoader, { ModuleConfig } from '@vue-async/module-loader';
import { root, megreRoutes, lazyLoadView } from '../router/utils';

// Types
import { Plugin } from '@nuxt/types';

Vue.use(ModuleLoader);

const plugin: Plugin = async (cxt) => {
  const { app } = cxt;

  // if (process.server) {
  //   beforeNuxtRender(({ Components, nuxtState }) => {
  //     nuxtState.test = true;
  //   });
  // }

  function addRoutes(routes: RouteConfig[]) {
    const options = (app.router as any).options;
    // 合并路由
    megreRoutes(options.routes, root(routes));
    const newRouter = new VueRouter(options);
    (app.router as any).matcher = (newRouter as any).matcher;
  }

  const moduleLoader = new ModuleLoader({
    layout: {},
    addRoutes,
  });

  // should be loading config from remote here
  addRoutes([
    {
      path: 'remote-component-a',
      name: 'remote-component-a',
      component: () =>
        lazyLoadView(
          moduleLoader.loadComponent(
            'componentA',
            'http://localhost:7002/componentA/componentA.umd.js',
            'http://localhost:7002/componentA/componentA.css',
          ),
        ),
    },
    // 同一链接同时多次调用时有问题
    {
      path: 'wrong-component-name',
      name: 'wrong-component-name',
      component: () =>
        lazyLoadView(
          moduleLoader.loadComponent('wrongComponentName', 'http://localhost:7002/componentB/componentB.umd.js'),
        ),
    },
    {
      path: 'wrong-component-entry',
      name: 'wrong-component-entry',
      component: () =>
        lazyLoadView(moduleLoader.loadComponent('entry', 'http://www.xx.com/modules/componentB/errorComponent.umd.js')),
    },
    {
      path: 'component-loading',
      name: 'component-loading',
      component: () =>
        lazyLoadView(
          new Promise((resolve) => {
            setTimeout(() => {
              moduleLoader
                .loadComponent('componentA', 'http://localhost:7002/componentA/componentA.umd.js')
                .then(resolve);
            }, 3000);
          }),
        ),
    },
  ]);

  const modules: ModuleConfig[] = [
    {
      // page 异步加载
      dymanicRouter: {
        entry: 'http://localhost:7002/dymanicRouter/dymanicRouter.umd.js',
        args: {
          addRoutes,
        },
      },

      sortTest: 'http://localhost:7002/sortTest/sortTest.umd.js',
    },
    // {
    //   moduleName: 'module-js',
    //   entry: 'http://localhost:7002/module-js/module-js.umd.js',
    //   styles: 'http://localhost:7002/module-js/module-js.css',
    // },
    // {
    //   // 同名
    //   moduleName: 'dymanicComponent',
    //   entry: 'http://localhost:7002/dymanicComponentCopy/dymanicComponent.umd.js',
    //   styles: 'http://localhost:7002/dymanicComponentCopy/dymanicComponent.css',
    // },
    // {
    //   // 错误 module name (执行正常, 但不能跟在相同 entry 后面执行, 会找不到模块)
    //   moduleName: 'wrongName',
    //   entry: 'http://localhost:7002/dymanicComponentCopy/dymanicComponent.umd.js',
    // },
    // {
    //   // 错误 entry (执行 error)
    //   moduleName: 'wrongEntry',
    //   entry: 'http://www.xx.com/error.umd.js',
    // },
    // // function module
    // (_Vue: any) => {
    //   console.log('[dev] function module');
    // },
  ];

  await moduleLoader
    .load(modules, {
      sync: true,
      // success: () => {
      //   // app.$mount('#app');
      // },
      error(msg: string, module: any) {
        // eslint-disable-next-line no-console
        console.warn(`[dev] ${msg}`, module);
      },
    })
    .then(() => {
      // then won't exec when success set up
    });

  cxt.app.moduleLoader = moduleLoader;
  cxt.$moduleLoader = moduleLoader;
};

export default plugin;
