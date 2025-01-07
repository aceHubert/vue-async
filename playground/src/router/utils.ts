import { defineComponent, defineAsyncComponent, h, AsyncComponentOptions, Component } from 'vue-demi';

const LoadingComponent = defineComponent({
  render() {
    return h('h1', {}, 'Loading...');
  },
});

const ErrorComponent = defineComponent({
  render() {
    return h('h1', { style: 'color:red' }, 'Load component error.');
  },
});

// https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/router/routes.js#L93-L131
export function lazyLoadView(
  asyncView: () => Promise<Component>,
  {
    loadingComponent = LoadingComponent,
    errorComponent = ErrorComponent,
    delay = 200,
    timeout = 5000,
    suspensible = false,
    onError,
  }: Omit<AsyncComponentOptions, 'loader'> = {},
) {
  const asyncHander = defineAsyncComponent({
    loader: asyncView,
    // A component to use while the component is loading.
    loadingComponent,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    errorComponent,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout,
    suspensible,
    onError,
  });

  return defineComponent({
    setup(props, context) {
      return () => h(asyncHander, context.attrs, context.slots);
    },
  });
}
