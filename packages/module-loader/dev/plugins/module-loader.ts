/* eslint-disable no-console */
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import ModuleLoader from '@vue-async/module-loader';
import { root, megreRoutes, lazyLoadView } from '../router/utils';

Vue.use(ModuleLoader);

// Types
import { Plugin } from '@nuxt/types';

const plugin: Plugin = async (cxt) => {
  const { app, store } = cxt;

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

  // should be loading config from remote here
  addRoutes([
    {
      path: 'remote-component-a',
      name: 'remote-component-a',
      component: () =>
        lazyLoadView(
          Vue.prototype.$componentLoader('componentA', 'http://localhost:7001/modules/componentA/componentA.umd.js'),
        ),
    },
    // 同一链接同时多次调用时有问题
    {
      path: 'wrong-component-name',
      name: 'wrong-component-name',
      component: () =>
        lazyLoadView(
          Vue.prototype.$componentLoader(
            'wrongComponentName',
            'http://localhost:7001/modules/componentB/componentB.umd.js',
          ),
        ),
    },
    {
      path: 'wrong-component-entry',
      name: 'wrong-component-entry',
      component: () =>
        lazyLoadView(
          Vue.prototype.$componentLoader('entry', 'http://www.xx.com/modules/componentB/errorComponent.umd.js'),
        ),
    },
    {
      path: 'component-loading',
      name: 'component-loading',
      component: () =>
        lazyLoadView(
          new Promise((resolve) => {
            setTimeout(() => {
              Vue.prototype
                .$componentLoader('componentA', 'http://localhost:7001/modules/componentA/componentA.umd.js')
                .then(resolve);
            }, 3000);
          }),
        ),
    },
  ]);

  const moduleLoader = new ModuleLoader({
    addRoutes,
  }).registerDynamicComponent(store);

  await moduleLoader
    .load(
      [
        {
          // page 异步加载，样式限 page load 加载出来
          dymanicRouter: {
            entry: 'http://localhost:7001/modules/dymanicRouter/dymanicRouter.umd.js',
            // css: ['http://localhost:7001/modules/dymanicRouter/css/1.281753bd.css', 'http://localhost:7001/modules/dymanicRouter/css/2.2b65cb29.css'],
            args: {
              addRoutes,
            },
          },
          dymanicComponent: {
            entry: 'http://localhost:7001/modules/dymanicComponent/dymanicComponent.umd.js',
            styles: 'http://localhost:7001/modules/dymanicComponent/dymanicComponent.css',
          },
          sortTest: 'http://localhost:7001/modules/sortTest/sortTest.umd.js',
        },
        {
          // 同名
          moduleName: 'dymanicComponent',
          entry: 'http://localhost:7001/modules/dymanicComponentCopy/dymanicComponent.umd.js',
          styles: 'http://localhost:7001/modules/dymanicComponentCopy/dymanicComponent.css',
        },
        {
          // 错误 module name (执行正常, 但不能跟在相同 entry 后面执行, 会找不到模块)
          moduleName: 'wrongName',
          entry: 'http://localhost:7001/modules/dymanicComponentCopy/dymanicComponent.umd.js',
        },
        {
          // 错误 entry (执行 error)
          moduleName: 'wrongEntry',
          entry: 'http://www.xx.com/error.umd.js',
        },
        // function module
        (_Vue: any) => {
          console.log('[dev] function module');
        },
      ],
      {
        sync: true,
        // success: () => {
        //   // app.$mount('#app');
        // },
        error(msg: string, module: any) {
          // eslint-disable-next-line no-console
          console.warn(`[dev] ${msg}`, module);
        },
      },
    )
    .then(() => {
      // then won't exec when success set up
    });

  cxt.app.moduleLoader = moduleLoader;
  cxt.$moduleLoader = moduleLoader;
};

export default plugin;
