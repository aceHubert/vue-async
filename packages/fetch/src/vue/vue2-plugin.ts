import { fetchSymbol } from './rootFetch';

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
        (this as any)._provided[fetchSymbol as any] = fetch;

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
