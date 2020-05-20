import Vue from 'vue';
import App from './App';
import ResourceManager from '@vue-async/resource-manager';

Vue.use(ResourceManager, { mode: 'invisible' });

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
