import { defineComponent, defineAsyncComponent, h, AsyncComponentOptions, Component } from 'vue-demi';
import { RouteRecordRaw } from 'vue-router';

// 模块中路由配置没有根前缀，用于主程序自定义
export function root(routes: RouteRecordRaw[]) {
  return routes.map((route) => {
    route.path = '/' + route.path;
    return route;
  });
}

// 合并路由（将新路由配置合并到老路由配置中）
export const megreRoutes = (oldRoutes: RouteRecordRaw[], newRoutes: RouteRecordRaw[]) => {
  newRoutes.forEach((current: RouteRecordRaw) => {
    const matchRoute = oldRoutes.find(
      (route: RouteRecordRaw) => (current.name && route.name === current.name) || route.path === current.path,
    );
    if (matchRoute) {
      // 如果找到已在在的
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, name, ...restOptions } = current;
      Object.assign(matchRoute, restOptions); // 合并路由参数

      if (children) {
        !matchRoute.children && (matchRoute.children = []);
        megreRoutes(matchRoute.children, children);
      }
    } else {
      // 插入到 path:'*'之前
      const insertIndex = oldRoutes.findIndex((route: RouteRecordRaw) => route.path === '*');
      // 如果没找到
      oldRoutes.splice(insertIndex < 0 ? 0 : insertIndex, 0, current);
    }
  });
};

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
    timeout = 10000,
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
