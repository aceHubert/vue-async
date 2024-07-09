/* eslint-disable no-console */
import * as Vue from 'vue';
import { defineNuxtPlugin } from 'nuxt/app';
import { Router, RouteRecordRaw } from 'vue-router';
import { createLoader, registerSubModules, registerComponents } from '@vue-async/module-loader';
import { root, megreRoutes, lazyLoadView } from '../router/utils';

// make Vue as global in Vue 3
// @ts-ignore
window.Vue = Vue;

const useLoader = registerSubModules(
  [
    {
      // page 异步加载
      dymanicRouter: {
        entry: 'http://localhost:7010/dymanicRouter/index.umd.js',
        styles: 'http://localhost:7010/dymanicRouter/style.css',
        props: {
          testArg: 1,
        },
      },
      sortTest: 'http://localhost:7010/sortTest/index.umd.js',
    },
    {
      // 错误 entry (执行 error)
      name: 'wrongEntry',
      entry: 'http://www.xx.com/error.umd.js',
    },
    // function module
    (app) => {
      console.log('[dev] function module', app);
    },
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

const useComponents = registerComponents({
  componentA: {
    src: 'http://localhost:7010/componentA/index.umd.js',
    styles: 'http://localhost:7010/componentA/style.css',
  },
  componentB: {
    src: 'http://localhost:7010/componentB/index.umd.js',
    styles: 'http://localhost:7010/componentB/style.css',
  },
  // 可以正常加载
  wrongComponentName: 'http://localhost:7010/componentB/index.umd.js',
  wrongEntry: 'http://www.xx.com/modules/componentB/errorComponent.umd.js',
});

export default defineNuxtPlugin({
  name: 'module-loader',
  enforce: 'pre',
  async setup(nuxtApp) {
    const moduleLoader = createLoader();

    nuxtApp.vueApp.use(moduleLoader);

    const router = nuxtApp.$router as Router;

    moduleLoader
      .setOptions({
        loading: () => {
          // JsLoadingOverlay.show();
          console.log('module lading');
          return () => {
            // JsLoadingOverlay.hide();
            console.log('module lading finished');
          };
        },
        register: (options) => {
          if (options.routes) {
            options.routes.forEach((route) => {
              router.addRoute(route);
            });
          }
        },
      })
      .addErrorHandler((error, config) => {
        console.error(`onError:${config.name}, ${error.message}`);
      });

    await useLoader().start({ router });

    const components = useComponents();

    // 添加路由获取远程组件
    [
      {
        path: '/remote-component-route',
        name: 'remote-component-route',
        component: () => lazyLoadView(components.componentA),
      },
      {
        path: '/wrong-name-remote-component',
        name: 'wrong-name-remote-component',
        component: () => lazyLoadView(components.wrongComponentName),
      },
      {
        path: '/wrong-entry-remote-component',
        name: 'wrong-entry-remote-component',
        component: () => lazyLoadView(components.wrongEntry),
      },
      {
        path: '/lazy-loading-remote-component',
        name: 'lazy-loading-remote-component',
        component: () =>
          lazyLoadView(
            () =>
              new Promise((resolve) => {
                setTimeout(() => {
                  components.componentB().then(resolve);
                }, 3000);
              }),
          ),
      },
    ].forEach((route) => router.addRoute(route));

    // plugin nuxt:router would run afterEach immediately and showError with unknown route
    await nuxtApp.runWithContext(clearError);
  },
  env: {
    islands: false,
  },
});

declare module '@vue-async/module-loader' {
  interface RegisterProperties {
    routes?: RouteRecordRaw[];
  }
}
