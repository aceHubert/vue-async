/**
 * base
 */
import { Route, RawLocation } from 'vue-router';

export const BaseRoutes = [
  {
    path: '',
    name: 'index',
    // https://github.com/vuejs/vue-router/issues/1762
    beforeEnter: (to: Route, from: Route, next: (to?: RawLocation) => void) => {
      next({ name: 'dashboard', params: to.params });
    },
    // redirect: { name: 'dashboard' },
  },
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "base" */ '@/views/dashboard'),
    props: true,
  },
  {
    path: 'test',
    name: 'test',
    component: () => import(/* webpackChunkName: "base" */ '@/views/test'),
  },
];
