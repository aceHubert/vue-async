import Vue from 'vue';
import App from '@/App';
import router from '@/router';
import store from '@/store';

// plugins
import { createI18n } from '@/plugins/i18n';
import { createVuetify } from '@/plugins/vuetify';
import { createModuleLoader } from '@/plugins/module-loader';

// styles
import '@/assets/styles/index.scss';

Vue.config.productionTip = false;

const i18n = createI18n(null, { router });
const vuetify = createVuetify(null, { i18n });
const moduleLoader = createModuleLoader(null, { i18n });

new Vue({
  router,
  store,
  i18n,
  vuetify,
  moduleLoader,
  render: (h: any) => h(App),
}).$mount('#app');
