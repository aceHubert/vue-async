import { Vue2 } from 'vue-demi';
import { FetchSymbol } from './rootFetch';

export function FetchVuePlugin(Vue: any) {
  // Used to avoid multiple mixins being setup
  // when in dev mode and hot module reload
  // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
  if (Vue.$__fetch_installed__) return;
  // eslint-disable-next-line @typescript-eslint/camelcase
  Vue.$__fetch_installed__ = true;

  // Equivalent of
  // app.config.globalProperties.$fetch = fetch
  Vue.mixin({
    beforeCreate() {
      const options = this.$options;
      if (options.fetch) {
        const fetch = options.fetch;
        // HACK: taken from provide(): https://github.com/vuejs/composition-api/blob/main/src/apis/inject.ts#L31
        if (!(this as any)._provided) {
          const provideCache = {};
          Object.defineProperty(this, '_provided', {
            get: () => provideCache,
            set: (v) => Object.assign(provideCache, v),
          });
        }
        (this as any)._provided[FetchSymbol as any] = fetch;

        // propagate the fetch instance in an SSR friendly way
        // avoid adding it to nuxt twice
        if (!this.$pinia) {
          this.$fetch = fetch;
        }

        fetch._a = this as any;
      } else {
        this.$fetch = (options.parent && options.parent.$fetch) || this;
      }
    },
  });
}

// Auto install if it is not done yet and `window` has `Vue` in Vue2.
// To allow users to avoid auto-installation in some cases,
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(FetchVuePlugin);
}

// @internal
declare global {
  interface Window {
    Vue: typeof Vue2;
  }
}