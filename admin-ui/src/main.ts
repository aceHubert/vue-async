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

const app = new Vue({
  router,
  store,
  i18n,
  vuetify,
  moduleLoader,
  render: (h: any) => h(App),
});

const defaultModules =
  process.env.NODE_ENV === 'production'
    ? {
        'module-js': 'https://async-modules.netlify.app/module-js/module-js.umd.js',
        'module-ts': 'https://async-modules.netlify.app/module-ts/module-ts.umd.js',
      }
    : {
        'module-js': 'http://localhost:3000/module-js/module-js.umd.js',
        'module-ts': 'http://localhost:3000/module-ts/module-ts.umd.js',
      };

app
  .$moduleLoader({
    ...defaultModules,
  })
  .then((_) => {
    app.$mount('#app');
  });
