import Vue from 'vue';
import warning from 'warning';
import { del, add, has } from './Suspense';
import { currentSuspenseInstance } from './currentInstance';
import findSuspenseInstance from './findSuspenseInstance';

// Types
import { Component as VueComponent, VNode } from 'vue';
import { ExtendedVue } from 'vue/types/vue';
import { PropsDefinition, DefaultProps } from 'vue/types/options';
import { AsyncFactory, SuspenseComponent } from 'types/resource-mananger';

export default function Lazy<PropsDef = PropsDefinition<DefaultProps>>(
  asyncFactory: AsyncFactory,
  props?: PropsDef,
): ExtendedVue<Vue, {}, {}, {}, PropsDef> {
  return Vue.extend({
    name: 'VueSuspenseLazy',
    props: props,
    created() {
      asyncFactory.suspenseInstance = (currentSuspenseInstance as Vue) || findSuspenseInstance(this);

      if (has(asyncFactory)) return;

      add(asyncFactory);

      if (asyncFactory.resolved) {
        (asyncFactory.$$waiter as Promise<SuspenseComponent>).then(() => {
          del(asyncFactory);
        });
        return;
      }
      const promise = asyncFactory();
      asyncFactory.$$waiter = promise;

      promise
        .then((C) => {
          // Compatible ES Module
          if (C.__esModule && C.default) {
            C = C.default;
          }
          asyncFactory.resolved = C;
          // Trigger update
          this.$forceUpdate();
        })
        .catch((err) => {
          warning(process.env.NODE_ENV === 'production', err.message);
          del(asyncFactory, err);
        });
    },
    updated() {
      del(asyncFactory);
    },
    render(this: Vue, h) {
      // Fix context
      const slots = Object.keys(this.$slots)
        .reduce((arr, key) => (arr as VNode[]).concat(this.$slots[key] || []), [] as VNode[])
        .map((vnode: VNode) => {
          vnode.context = this._self;
          return vnode;
        });

      return asyncFactory.resolved
        ? h(
            asyncFactory.resolved as VueComponent,
            {
              on: this.$listeners,
              // If there is no props definition, fall back to `this.$attrs`
              props: props ? this.$props : this.$attrs,
              // Passthrough scopedSlots
              scopedSlots: this.$scopedSlots,
              attrs: this.$attrs,
            },
            slots,
          )
        : this._e();
    },
  });
}
