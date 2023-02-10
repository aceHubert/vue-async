import warning from 'warning';
import { defineComponent, getCurrentInstance, onUpdated, h as _h, createCommentVNode, DefineComponent } from 'vue-demi';
import { del, add, has } from './Suspense';
import { currentSuspenseInstance, findSuspenseInstance } from '../shared/suspenseInstance';

// Types
import { AsyncFactory, SuspenseComponent } from '../types';

export const lazy = <PropsDef = {}>(asyncFactory: AsyncFactory, props: PropsDef) => {
  return defineComponent({
    name: 'VueSuspenseLazy',
    // @ts-ignore
    props,
    setup(props, { slots, attrs }) {
      const currInstance = getCurrentInstance();
      asyncFactory.suspenseInstance = currentSuspenseInstance || findSuspenseInstance(currInstance!.proxy!);

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
        .then((C: any) => {
          // Compatible ES Module
          if (C.__esModule && C.default) {
            C = C.default;
          }
          asyncFactory.resolved = C;
          // Trigger update
          currInstance?.proxy?.$forceUpdate();
        })
        .catch((err: any) => {
          warning(process.env.NODE_ENV === 'production', err.message);
          del(asyncFactory, err);
        });

      onUpdated(() => {
        del(asyncFactory);
      });

      return () =>
        asyncFactory.resolved ? _h(asyncFactory.resolved as any, { ...props, ...attrs }, slots) : createCommentVNode();
    },
  }) as DefineComponent<PropsDef>;
};
