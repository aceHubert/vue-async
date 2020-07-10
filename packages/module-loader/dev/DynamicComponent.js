export default Vue.extend({
  name: 'DynamicComponent',
  render(h) {
    return h('h1', { style: { color: 'red' } }, 'DynamicComponent');
  },
});
