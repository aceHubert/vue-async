import warning from 'warning';
import { defineComponent, getCurrentInstance, ref, onMounted, h as _h, createCommentVNode, onUpdated } from 'vue-demi';
import { debug } from '../env';
import { COMPONENT_NAME } from '../shared/context';
import { pushSuspenseInstance, popSuspenseInstance } from '../shared/suspenseInstance';
import { FragmentComponent as Fragment } from '../shared/fragment';

// Types
import type { Component as VueComponent, VNode, PropType } from 'vue-demi';
import type { AsyncFactory, SuspenseOptions } from '../types';

export const del = <I extends any[], R, E>(asyncFactory: AsyncFactory<I, R>, error?: E) => {
  const suspIns = asyncFactory.suspenseInstance;
  if (!suspIns) {
    return warning(!debug, 'No Suspense instance');
  }
  const asyncFactorys = suspIns.asyncFactorys;

  if (error) {
    suspIns.reject(error);
    return;
  }

  asyncFactorys.delete(asyncFactory);
  if (asyncFactorys.size === 0) {
    suspIns.resolve();
  }
};

export const add = <I extends any[], R>(asyncFactory: AsyncFactory<I, R>) => {
  const suspIns = asyncFactory.suspenseInstance;
  if (!suspIns) {
    return warning(!debug, 'No Suspense instance');
  }
  const asyncFactorys = suspIns.asyncFactorys || (suspIns.asyncFactorys = new Set());

  asyncFactorys.add(asyncFactory);
  suspIns.fallback();
};

export const has = <I extends any[], R>(asyncFactory: AsyncFactory<I, R>) => {
  const suspIns = asyncFactory.suspenseInstance;
  if (!suspIns) {
    return warning(!debug, 'No Suspense instance');
  }
  return suspIns.asyncFactorys && suspIns.asyncFactorys.has(asyncFactory);
};

export const suspenseOptions: Required<SuspenseOptions> = {
  mode: 'visible',
  hiddleWrapperTag: 'div',
};

export function setSuspenseOptions(options: SuspenseOptions) {
  Object.assign(suspenseOptions, options);
}

/**
 * Suspense component,
 * Vue2 compatible
 */
export const Suspense = defineComponent({
  name: COMPONENT_NAME,
  props: {
    timeout: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  emits: ['pending', 'resolve', 'fallback'],
  setup(props, { slots, emit }) {
    const resolved = ref(false);
    const rejected = ref(false);
    const displayFallback = ref(false);

    let _time: ReturnType<typeof setTimeout> | null;

    const setupFallback = () => {
      if (resolved.value) return;

      if (!displayFallback.value) {
        emit('pending');

        if (props.timeout > 0) {
          _time = setTimeout(() => {
            displayFallback.value = true;
            emit('fallback');
          }, props.timeout);
        } else if (props.timeout === 0) {
          displayFallback.value = true;
          emit('fallback');
        }
      }
    };

    const destoryFallback = () => {
      if (_time) {
        clearTimeout(_time);
        _time = null;
      }
      displayFallback.value = false;
    };

    const onResolve = () => {
      destoryFallback();
      emit('resolve');
      resolved.value = true;
    };

    const onReject = (err: unknown) => {
      destoryFallback();
      emit('fallback');
      rejected.value = true;
    };

    const currPublicInstance = getCurrentInstance()!.proxy!;
    currPublicInstance.resolve = onResolve;
    currPublicInstance.reject = onReject;
    currPublicInstance.fallback = setupFallback;

    pushSuspenseInstance(currPublicInstance);

    onMounted(() => {
      if (!currPublicInstance.asyncFactorys) {
        onResolve();
      }
    });

    onUpdated(() => {
      if (!resolved.value) return;
      popSuspenseInstance();
    });

    function createWrapper(children: any): VNode {
      if (typeof children !== 'function') {
        children = () => children;
      }
      return _h(Fragment, children);
    }

    function createHiddenWrapper(children: any, display: boolean): VNode {
      if (typeof children !== 'function') {
        children = () => children;
      }
      return _h(
        suspenseOptions.hiddleWrapperTag,
        {
          style: { display: display ? 'block' : 'none' },
          class: { 'suspense-hidden-wrapper': true },
        },
        children,
      );
    }

    return () => {
      const isVisible = suspenseOptions.mode === 'visible';
      const fallback = displayFallback.value
        ? slots.fallback?.() || (debug ? [createCommentVNode('no fallback')] : [])
        : [];
      // The `children` is the real content to be rendered
      const children = slots.default?.() || (debug ? [createCommentVNode('no default slot')] : []);

      let rendered;
      if (rejected.value && slots.error) {
        rendered = createWrapper(slots.error);
      } else {
        rendered = isVisible
          ? createWrapper(resolved.value ? children : children.concat(fallback))
          : createWrapper([
              // We need to render the children, but we should not show the rendered content.
              createHiddenWrapper(children, resolved.value),
              fallback,
            ]);
      }

      return rendered;
    };
  },
});

/**
 * @internal
 */
// @ts-ignore: works on Vue 3, fails in Vue 2
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    resolve(): void;
    reject(err: unknown): void;
    fallback(): void;
    asyncFactorys: Set<AsyncFactory<any, VueComponent & { __esModule?: any; default?: VueComponent }>>;
  }
}
