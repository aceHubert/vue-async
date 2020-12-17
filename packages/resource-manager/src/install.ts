import Suspense, { COMPONENT_NAME } from './ability/Suspense';
import lazy from './ability/lazy';
import createResource from './ability/createResource';

// Types
import { VueConstructor } from 'vue';
import { UseOptions } from 'types/resource-mananger';

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

  Vue.lazy = lazy.bind(null);

  Object.defineProperties(Vue.prototype, {
    createResource: {
      value: createResource.bind(null),
      writable: false,
      enumerable: true,
      configurable: true,
    },
  });

  Vue.mixin({
    created(this: Vue) {
      if (this.$options.name === COMPONENT_NAME) {
        this.$options.suspense = opts;
      }
    },
  });
}
