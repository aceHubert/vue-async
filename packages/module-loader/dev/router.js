/**
 * router
 */
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
function root(routes) {
  return routes.map((route) => {
    route.path = '/' + route.path;
    return route;
  });
}

export function addRoutes(routes) {
  const options = router.options;
  // 合并路由
  options.routes = root(routes).concat(options.routes);
  const newRouter = new VueRouter(options);
  router.matcher = newRouter.matcher;
}

export default router;
