import Vue from 'vue';
import router, { addRoutes } from './router';
import store from './store';
import ModuleLoader from '@vue-async/module-loader';
import App from './app';

const moduleLoader = new ModuleLoader({
  addRoutes, // 重写 addRoutes
});

const vm = new Vue({
  router,
  store,
  moduleLoader,
  render: (h) => h(App),
});

vm.$moduleLoader({
  dymanicRouter: '/static/dymanicRouter.umd.js',
  dymanicComponent: '/static/dymanicComponent.umd.js',
}).then(() => {
  vm.$mount('#app');
});
