/* eslint-disable no-console */
import { defineNuxtPlugin } from 'nuxt/app';
// import { createRouter, RouteRecordRaw } from 'vue-router';
import { createLoader, registerSubModules, setModuleLoaderOptions, addErrorHandler } from '@vue-async/module-loader';
import { root, megreRoutes, lazyLoadView } from '../utils/router';

registerSubModules(
  [
    {
      // page 异步加载
      dymanicRouter: {
        entry: 'http://localhost:7010/dymanicRouter/dymanicRouter.umd.js',
        activeRule: '/dymanic-router',
        props: {
          testArg: 1,
        },
      },
      sortTest: 'http://localhost:7010/sortTest/sortTest.umd.js',
    },
    // {
    //   name: 'module-js',
    //   entry: 'http://localhost:7010/module-js/module-js.umd.js',
    //   styles: 'http://localhost:7010/module-js/module-js.css',
    // },
    // {
    //   // 同名
    //   name: 'dymanicComponent',
    //   entry: 'http://localhost:7010/dymanicComponentCopy/dymanicComponent.umd.js',
    //   styles: 'http://localhost:7010/dymanicComponentCopy/dymanicComponent.css',
    // },
    // {
    //   // 错误 module name (执行正常, 但不能跟在相同 entry 后面执行, 会找不到模块)
    //   name: 'wrongName',
    //   entry: 'http://localhost:7010/dymanicComponentCopy/dymanicComponent.umd.js',
    // },
    // {
    //   // 错误 entry (执行 error)
    //   name: 'wrongEntry',
    //   entry: 'http://www.xx.com/error.umd.js',
    // },
    // // function module
    // (_Vue: any) => {
    //   console.log('[dev] function module');
    // },
  ],
  {
    beforeLoad: (config) => {
      console.log(`beforeLoad:${config.name}`);
    },
    beforeMount: (config) => {
      console.log(`beforeMount:${config.name}`);
    },
    afterMount: (config) => {
      console.log(`afterMount:${config.name}`);
    },
    beforeUnmount: (config) => {
      console.log(`beforeUnmount:${config.name}`);
    },
    afterUnmount: (config) => {
      console.log(`afterUnmount:${config.name}`);
    },
  },
);

setModuleLoaderOptions({
  loading: () => {
    // JsLoadingOverlay.show();
    console.log('module lading');
    return () => {
      // JsLoadingOverlay.hide();
      console.log('module lading finished');
    };
  },
});

addErrorHandler((error, config) => {
  console.error(`onError:${config.name}, ${error.message}`);
});

export default defineNuxtPlugin(async (nuxtApp) => {
  // if (process.server) {
  //   beforeNuxtRender(({ Components, nuxtState }) => {
  //     nuxtState.test = true;
  //   });
  // }

  // function addRoutes(routes: RouteRecordRaw[]) {
  //   const options = (nuxtApp.router as any).options;
  //   // 合并路由
  //   megreRoutes(options.routes, root(routes));
  //   const newRouter = createRouter(options);
  //   (app.router as any).matcher = (newRouter as any).matcher;
  // }

  const moduleLoader = createLoader();

  nuxtApp.vueApp.use(moduleLoader);

  // 添加路由获取远程组件
  // addRoutes([
  //   {
  //     path: 'remote-component',
  //     name: 'remote-component',
  //     component: () =>
  //       lazyLoadView(
  //         moduleLoader.loadComponent(
  //           'componentA',
  //           'http://localhost:7010/componentA/componentA.umd.js',
  //           'http://localhost:7010/componentA/componentA.css',
  //         ),
  //       ),
  //   },
  //   // 同一链接同时多次调用时有问题
  //   {
  //     path: 'wrong-name-remote-component',
  //     name: 'wrong-name-remote-component',
  //     component: () =>
  //       lazyLoadView(() =>
  //         moduleLoader.loadComponent('wrongComponentName', 'http://localhost:7010/componentB/componentB.umd.js'),
  //       ),
  //   },
  //   {
  //     path: 'wrong-entry-remote-component',
  //     name: 'wrong-entry-remote-component',
  //     component: () =>
  //       lazyLoadView(() =>
  //         moduleLoader.loadComponent('entry', 'http://www.xx.com/modules/componentB/errorComponent.umd.js'),
  //       ),
  //   },
  //   {
  //     path: 'lazy-loading-remote-component',
  //     name: 'lazy-loading-remote-component',
  //     component: () =>
  //       lazyLoadView(
  //         () =>
  //           new Promise((resolve) => {
  //             setTimeout(() => {
  //               moduleLoader
  //                 .loadComponent('componentA', 'http://localhost:7010/componentA/componentA.umd.js')
  //                 .then(resolve);
  //             }, 3000);
  //           }),
  //       ),
  //   },
  // ]);
});
