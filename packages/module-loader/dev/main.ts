// import Vue from 'vue';
import router, { addRoutes, lazyLoadView } from './router';
import store from './store';
import ModuleLoader from '@vue-async/module-loader';
import App from './app';

const moduleLoader = new ModuleLoader<{ addMenus: (menu: any) => void }>({
  addRoutes, // 重写 addRoutes,
  addMenus: (_menus: any) => {}, // 自定义方法
});

const app = new Vue({
  router,
  store,
  moduleLoader,
  render: (h: any) => h(App),
});

// should be loading config from remote here
addRoutes([
  {
    path: 'remote-component-a',
    name: 'remote-component-a',
    component: () => lazyLoadView(app.$componentLoader('componentA', '/static/componentA/componentA.umd.min.js')),
  },
  {
    path: 'remote-component-b',
    name: 'remote-component-b',
    component: () => lazyLoadView(app.$componentLoader('componentB', '/static/componentB/componentB.umd.min.js')),
  },
  {
    path: 'wrong-component-name',
    name: 'wrong-component-name',
    component: () =>
      lazyLoadView(app.$componentLoader('wrongComponentName', '/static/componentB/componentB.umd.min.js')),
  },
  {
    path: 'wrong-component-entry',
    name: 'wrong-component-entry',
    component: () =>
      lazyLoadView(app.$componentLoader('entry', 'http://www.xx.com/static/componentB/errorComponent.umd.min.js')),
  },
]);

app
  .$moduleLoader(
    [
      {
        dymanicRouter: '/static/dymanicRouter/dymanicRouter.umd.js',
        // page 异步加载，样式限 page load 加载出来
        // dymanicRouter: {
        //   entry: '/static/dymanicRouter/dymanicRouter.umd.min.js',
        //   css: ['/static/dymanicRouter/css/1.281753bd.css', '/static/dymanicRouter/css/2.2b65cb29.css'],
        // },
        dymanicComponent: {
          entry: '/static/dymanicComponent/dymanicComponent.umd.min.js',
          styles: '/static/dymanicComponent/dymanicComponent.css',
        },
      },
      {
        // 同名
        moduleName: 'dymanicComponent',
        entry: '/static/dymanicComponentCopy/dymanicComponent.umd.min.js',
        styles: '/static/dymanicComponentCopy/dymanicComponent.css',
      },
      {
        // 错误 module name (执行正常)
        moduleName: 'wrongName',
        entry: '/static/dymanicComponentCopy/dymanicComponent.umd.min.js',
      },
      {
        // 错误 entry (执行 error)
        moduleName: 'wrongEntry',
        entry: 'http://www.xx.com/error.umd.min.js',
      },
      // fn
      // (Vue: any) => {
      //   console.log(Vue);
      // },
    ],
    {
      success: () => {
        app.$mount('#app');
      },
      error(msg, module) {
        console.warn(msg, module);
      },
    },
  )
  .then(() => {
    // then won't exec when success is set in options
  });
