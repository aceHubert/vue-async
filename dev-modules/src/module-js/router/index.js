import PageA from '../pages/pageA';
import PageB from '../pages/pageB';

export default [
  {
    path: 'remote-page-a',
    name: 'remote-page-a',
    component: PageA,
    meta: {
      layout: 'remote',
    },
  },
  {
    path: 'remote-page-b',
    name: 'remote-page-b',
    component: PageB,
    meta: {
      title: 'js.page_b',
      layout: 'remote',
    },
  },
];
