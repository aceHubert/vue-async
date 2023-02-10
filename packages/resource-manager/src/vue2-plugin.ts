import { Vue2, isVue2 } from 'vue-demi';
import Suspense from './core/Suspense';
import lazy from './core/lazy';
import createResource from './core/createResource';

export function ResourceManagerVuePlugin(Vue: typeof Vue2) {
  Vue.component('Suspense', Suspense);

  Vue.lazy = lazy.bind(null);

  Object.defineProperties(Vue.prototype, {
    createResource: {
      value: createResource.bind(null),
      writable: false,
      enumerable: true,
      configurable: true,
    },
  });

  // Used to avoid multiple mixins being setup
  // when in dev mode and hot module reload
  // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
  if (Vue.$__resource_manager_installed__) return;
  // eslint-disable-next-line @typescript-eslint/camelcase
  Vue.$__resource_manager_installed__ = true;

  // Vue.mixin({
  //   created() {
  //     setCurrentInstance(this);
  //   },
  // });
}

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (isVue2 && typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ResourceManagerVuePlugin);
}

// @internal
declare global {
  interface Window {
    Vue: typeof Vue2;
  }
}
