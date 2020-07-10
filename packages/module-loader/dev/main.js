import Vue from 'vue';
import router from './router';
import store from './store';
import ModuleLoader from '@vue-async/module-loader';
import App from './app';

const moduleLoader = new ModuleLoader({});

const vm = new Vue({
  data: () => ({ isLoaded: document.readyState === 'complete' }),
  router,
  store,
  moduleLoader,
  render(h) {
    return this.isLoaded ? h(App) : undefined;
  },
}).$mount('#app');

// Prevent layout jump while waiting for styles
vm.isLoaded ||
  window.addEventListener('load', () => {
    vm.isLoaded = true;
  });
