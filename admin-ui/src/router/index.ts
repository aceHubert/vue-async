import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';
import { root } from './utils';

// routes
import { BaseRoutes } from './routes/base';

Vue.use(VueRouter);

Vue.use(VueMeta, {
  keyName: 'metaInfo',
  attribute: 'data-vue-meta',
  ssrAttribute: 'data-vue-meta-server-rendered',
  tagIDKeyName: 'vmid',
  refreshOnceOnNavigation: true,
});

const routes = root([
  ...BaseRoutes,
  {
    component: () => import('@/layouts/root'),
    path: '*',
    children: [
      {
        name: 'not-found',
        path: '',
        component: () => import('@/views/404'),
        meta: {
          title: 'Not Found',
        },
      },
    ],
  },
]);

console.log(routes);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
