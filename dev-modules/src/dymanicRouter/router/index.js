import PageA from '../pages/pageA.vue';
import PageB from '../pages/pageB.vue';

export default [
  {
    path: 'dymanic-page-a',
    name: 'dymanic-page-a',
    component: PageA,
  },
  {
    path: 'dymanic-page-b',
    name: 'dymanic-page-b',
    component: PageB,
    meta: {
      title: 'js.page_b',
    },
  },
];
