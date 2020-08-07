// app

export default Vue.extend({
  name: 'App',
  render(h) {
    return h('div', { domProps: { id: 'app' } }, [
      h(
        'router-link',
        { staticStyle: { margin: '0 10px 5px', display: 'block' }, props: { to: { name: 'remote-page-a' } } },
        'Remote Page A',
      ),
      h(
        'router-link',
        { staticStyle: { margin: '0 10px 5px', display: 'block' }, props: { to: { name: 'remote-component-a' } } },
        'Remote Component A as router component',
      ),
      h(
        'router-link',
        { staticStyle: { margin: '0 10px 5px', display: 'block' }, props: { to: { name: 'remote-component-b' } } },
        'Remote Component B as router component',
      ),
      h('router-view'),
    ]);
  },
});
