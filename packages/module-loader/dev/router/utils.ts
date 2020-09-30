import { Component as VueComponent } from 'vue';
import { RouteConfig } from 'vue-router';

// 模块中路由配置没有根前缀，用于主程序自定义
export function root(routes: RouteConfig[]) {
  return routes.map((route) => {
    route.path = '/' + route.path;
    return route;
  });
}

// 合并路由（将新路由配置合并到老路由配置中）
export const megreRoutes = (oldRoutes: RouteConfig[], newRoutes: RouteConfig[]) => {
  newRoutes.forEach((current: RouteConfig) => {
    const matchRoute = oldRoutes.find(
      (route: RouteConfig) => (current.name && route.name === current.name) || route.path === current.path,
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
      const insertIndex = oldRoutes.findIndex((route: RouteConfig) => route.path === '*');
      // 如果没找到
      oldRoutes.splice(insertIndex < 0 ? 0 : insertIndex, 0, current);
    }
  });
};

// https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/router/routes.js#L93-L131
export function lazyLoadView(
  asyncView: any,
  {
    loadingComponent,
    errorComponent,
    delay = 200,
    timeout = 10000,
  }: {
    loadingComponent?: VueComponent;
    errorComponent?: VueComponent;
    delay?: number;
    timeout?: number;
  } = {},
) {
  const AsyncHandler = () => ({
    component: asyncView,
    // A component to use while the component is loading.
    loading: loadingComponent || {
      render: (h: any) => h('h1', {}, 'Loading...'),
    },
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    error: errorComponent || {
      render: (h: any) => h('h1', {}, 'Load component error.'),
    },
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout,
  });

  return Promise.resolve({
    options: {}, // nuxtjs options.layout error
    functional: true,
    render(h: any, { data, children }: any) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children);
    },
  });
}
