
export default [{
  path: '/remote-page-a',
  name: 'remote-page-a',
  component: () => import('../pages/pageA.vue')
},
{
  path: '/remote-page-b',
  name: 'remote-page-b',
  component: () => import('../pages/pageB.vue'),
  meta: {
    title: '页面B'
  }
}]
