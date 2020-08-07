/**
 * router
 */
import { Component as VueComponent } from 'vue';
import { RouteConfig } from 'vue-router';
import Dashboard from './Dashboard';

const Notfound = {
  template: `<h3>Not Found</h3>`,
};

const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Dashboard,
    },
    { path: '*', component: Notfound },
  ],
});

// 模块中路由配置没有根前缀，用于主程序自定义
function root(routes: RouteConfig[]) {
  return routes.map((route) => {
    route.path = '/' + route.path;
    return route;
  });
}

export function addRoutes(routes: RouteConfig[]) {
  // @ts-ignore
  const options = router.options;
  // 合并路由
  options.routes = root(routes).concat(options.routes);
  const newRouter = new VueRouter(options);
  // @ts-ignore
  router.matcher = newRouter.matcher;
}

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
    functional: true,
    render(h: any, { data, children }: any) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children);
    },
  });
}

export default router;
