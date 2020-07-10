export default Vue.extend({
  name: 'Playground',
  computed: Vuex.mapState('dynamicComponent', { dynamicComponents: 'dynamic' }),
  render(h) {
    const children = Object.values(this.dynamicComponents || {}).map((component) => h(component));
    return h('div', { staticClass: 'playground' }, [h('h3', 'PLAYGROUND'), ...children]);
  },
});
