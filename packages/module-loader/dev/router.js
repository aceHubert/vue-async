/**
 * router
 */
const component1 = {
  template: `<div class="title">Page 1</div>`,
};
const notfound = {
  template: `<div class="title">Not Found</div>`,
};

const router = new VueRouter({
  routes: [
    {
      path: '/page1',
      name: 'Page 1',
      component: component1,
    },
    { path: '*', component: notfound },
  ],
});

export default router;
