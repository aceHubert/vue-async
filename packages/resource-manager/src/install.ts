import { VueConstructor } from 'vue';
import Suspense, { COMPONENT_NAME } from './Suspense';

export type UseOptions = {
  mode?: 'visible' | 'hidden';
};

export default function install(Vue: VueConstructor, options: UseOptions = {}) {
  if ((install as any).installed) return;
  (install as any).installed = true;

  Vue.component('Suspense', Suspense);

  const opts = Object.assign<UseOptions, UseOptions>(
    {
      mode: 'visible',
    },
    options,
  );

  Vue.setSuspenseOptions = (options: UseOptions) => {
    Object.assign(opts, options);
  };

  Vue.mixin({
    created(this: Vue) {
      if (this.$options.name === COMPONENT_NAME) {
        this.$options.suspense = opts;
      }
    },
  });
}
