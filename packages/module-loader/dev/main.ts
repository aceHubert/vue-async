import Vue from 'vue';
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
]);

app
  .$moduleLoader({
    dymanicRouter: '/static/dymanicRouter/dymanicRouter.umd.min.js',
    // page 异步加载，样式限 page load 加载出来
    // dymanicRouter: {
    //   entry: '/static/dymanicRouter/dymanicRouter.umd.min.js',
    //   css: ['/static/dymanicRouter/css/1.281753bd.css', '/static/dymanicRouter/css/2.2b65cb29.css'],
    // },
    dymanicComponent: {
      entry: '/static/dymanicComponent/dymanicComponent.umd.min.js',
      css: '/static/dymanicComponent/dymanicComponent.css',
    },
  })
  .then(() => {
    app.$mount('#app');
  });
