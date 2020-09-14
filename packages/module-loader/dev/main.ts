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
    component: () =>
      lazyLoadView(app.$componentLoader('componentA', 'http://localhost:7001/componentA/componentA.umd.min.js')),
  },
  {
    path: 'remote-component-b',
    name: 'remote-component-b',
    component: () =>
      lazyLoadView(app.$componentLoader('componentB', 'http://localhost:7001/componentB/componentB.umd.min.js')),
  },
  {
    path: 'wrong-component-name',
    name: 'wrong-component-name',
    component: () =>
      lazyLoadView(
        app.$componentLoader('wrongComponentName', 'http://localhost:7001/componentB/componentB.umd.min.js'),
      ),
  },
  {
    path: 'wrong-component-entry',
    name: 'wrong-component-entry',
    component: () =>
      lazyLoadView(
        app.$componentLoader('entry', 'http://www.xx.comhttp://localhost:7001/componentB/errorComponent.umd.min.js'),
      ),
  },
]);

app
  .$moduleLoader(
    [
      {
        dymanicRouter: 'http://localhost:7001/dymanicRouter/dymanicRouter.umd.js',
        // page 异步加载，样式限 page load 加载出来
        // dymanicRouter: {
        //   entry: 'http://localhost:7001/dymanicRouter/dymanicRouter.umd.min.js',
        //   css: ['http://localhost:7001/dymanicRouter/css/1.281753bd.css', 'http://localhost:7001/dymanicRouter/css/2.2b65cb29.css'],
        // },
        sortTest: 'http://localhost:7001/sortTest/sortTest.umd.js',
        dymanicComponent: {
          entry: 'http://localhost:7001/dymanicComponent/dymanicComponent.umd.js',
          styles: 'http://localhost:7001/dymanicComponent/dymanicComponent.css',
        },
      },
      {
        // 同名
        moduleName: 'dymanicComponent',
        entry: 'http://localhost:7001/dymanicComponentCopy/dymanicComponent.umd.min.js',
        styles: 'http://localhost:7001/dymanicComponentCopy/dymanicComponent.css',
      },
      {
        // 错误 module name (执行正常)
        moduleName: 'wrongName',
        entry: 'http://localhost:7001/dymanicComponentCopy/dymanicComponent.umd.min.js',
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
      // sync: true,
      success: () => {
        app.$mount('#app');
      },
      error(msg, module) {
        // eslint-disable-next-line no-console
        console.warn(msg, module);
      },
    },
  )
  .then(() => {
    // then won't exec when success set up
  });
