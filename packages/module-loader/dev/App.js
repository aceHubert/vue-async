// app

export default Vue.extend({
  name: 'App',
  render(h) {
    return h('div', { domProps: { id: 'app' } }, [
      h('router-link', { staticStyle: { margin: '0 10px; 5px' }, props: { to: { name: 'remote-page-a' } } }, 'Page A'),
      h('router-view'),
    ]);
  },
});
