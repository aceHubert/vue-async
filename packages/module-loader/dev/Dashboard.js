export default Vue.extend({
  name: 'Playground',
  computed: Vuex.mapState('dynamicComponent', { dynamicComponents: 'dashboard' }),
  render(h) {
    const children = Object.values(this.dynamicComponents || {}).map((component) =>
      h(component.component || component),
    );
    return h('div', { staticClass: 'playground' }, [h('h3', 'Dashboard'), ...children]);
  },
});
