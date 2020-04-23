import { VueConstructor } from 'vue';
import Suspense, { COMPONENT_NAME } from './Suspense';

export type Options = {
  mode: 'visible' | 'hidden';
};

const install = function(Vue: VueConstructor, options: Options) {
  Vue.component('Suspense', Suspense);

  const opts = Object.assign<Options, Options>(
    {
      mode: 'visible',
    },
    options,
  );

  Vue.setSuspenseOptions = (options: Options) => {
    Object.assign(opts, options);
  };

  Vue.mixin({
    created(this: Vue) {
      if (this.$options.name === COMPONENT_NAME) {
        this.$options.suspense = opts;
      }
    },
  });
};

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (window && (window as any).Vue) {
  (window as any).Vue.use(install);
}

export { Suspense };

export default {
  version: '0.1.0', // 使用version.ts全造成types多一级src目录
  install,
};
