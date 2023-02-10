import warning from 'warning';
import {
  defineComponent,
  getCurrentInstance,
  ref,
  onMounted,
  onUpdated,
  h as _h,
  createCommentVNode,
  DefineComponent,
  PropType,
  VNode,
} from 'vue-demi';
import { createEventBus } from '@vue-async/utils';
import { debug } from '../env';
import { suspenseOptions } from '../register';
import { COMPONENT_NAME, RESOLVED, REJECTED } from '../shared/context';
import { pushSuspenseInstance, popSuspenseInstance, currentSuspenseInstance } from '../shared/suspenseInstance';
import { FragmentComponent as Fragment } from '../shared/fragment';

// Types
import { AsyncFactory } from '../types';

export type SuspenseProps = {
  delay: number;
};

const eventBus = createEventBus();

export const del = (asyncFactory: AsyncFactory, error?: any) => {
  const suspIns = asyncFactory.suspenseInstance;
  if (!suspIns) {
    return warning(!debug, 'No Suspense instance');
  }
  const asyncFactorys = suspIns.asyncFactorys;

  if (error) {
    eventBus.emit(REJECTED, error);
    return;
  }

  asyncFactorys.delete(asyncFactory);
  if (asyncFactorys.size === 0) {
    eventBus.emit(RESOLVED);
  }
};

export const add = (asyncFactory: AsyncFactory) => {
  const suspIns = currentSuspenseInstance || asyncFactory.suspenseInstance;
  if (!suspIns) {
    return warning(!debug, 'No Suspense instance');
  }
  const asyncFactorys = suspIns.asyncFactorys || (suspIns.asyncFactorys = new Set());

  if (suspIns.resolved.value) {
    suspIns.resolved.value = false;
    suspIns.setupLoading();
  }
  asyncFactorys.add(asyncFactory);
};

export const has = (asyncFactory: AsyncFactory) => {
  const suspIns = currentSuspenseInstance || asyncFactory.suspenseInstance;
  if (!suspIns) {
    return warning(!debug, 'No Suspense instance');
  }
  return suspIns.asyncFactorys && suspIns.asyncFactorys.has(asyncFactory);
};

export const Suspense = defineComponent({
  name: COMPONENT_NAME,
  props: {
    delay: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  setup(props, { slots }) {
    const resolved = ref(false);
    const rejected = ref(false);
    const displayLoading = ref(false);

    let _time: number | null;

    const setupLoading = () => {
      if (props.delay > 0) {
        _time = window.setTimeout(() => {
          displayLoading.value = true;
        }, props.delay);
      } else {
        displayLoading.value = true;
      }
    };

    const destoryLoading = () => {
      if (_time) {
        clearTimeout(_time);
        _time = null;
      }
      displayLoading.value = false;
    };

    const promiser = new Promise((reslove, reject) => {
      eventBus.on(RESOLVED, () => {
        destoryLoading();
        resolved.value = true;
        reslove(null);
      });

      eventBus.on(REJECTED, (err: Error) => {
        destoryLoading();
        rejected.value = true;
        reject(err);
      });
    });

    const currPublicInstance = getCurrentInstance()!.proxy!;
    currPublicInstance.resolved = resolved;
    currPublicInstance.rejected = rejected;
    currPublicInstance.displayLoading = displayLoading;
    currPublicInstance.promiser = promiser;
    currPublicInstance.setupLoading = setupLoading;

    pushSuspenseInstance(currPublicInstance);

    // start loading
    setupLoading();

    onMounted(() => {
      if (!currPublicInstance.asyncFactorys) {
        eventBus.emit(RESOLVED);
      }
    });

    onUpdated(() => {
      if (!resolved.value) return;
      popSuspenseInstance();
    });

    return () => {
      const isVisible = suspenseOptions.mode === 'visible';
      const emptyVNode = createCommentVNode();
      const fallback = displayLoading.value ? slots.fallback?.() || [emptyVNode] : [emptyVNode];
      // The `children` is the real content to be rendered
      const children = slots.default?.() || [emptyVNode];

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
}) as DefineComponent<SuspenseProps>;

function createWrapper(children: any): VNode {
  return _h(Fragment, children);
}

function createHiddenWrapper(children: any, display: boolean): VNode {
  return display
    ? _h(Fragment, children)
    : _h(
        'div',
        {
          style: { display: 'none' },
          class: { 'vue-suspense-hidden-wrapper': true },
        },
        children,
      );
}
