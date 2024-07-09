import PageA from '../pages/pageA';
import PageB from '../pages/pageB';

export default [
  {
    path: '/dymanic-router/page-a',
    name: 'dymanic-page-a',
    component: PageA,
  },
  {
    path: '/dymanic-router/page-b',
    name: 'dymanic-page-b',
    component: PageB,
    meta: {
      title: 'js.page_b',
    },
  },
];
