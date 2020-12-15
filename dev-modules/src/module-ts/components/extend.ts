import Vue, { CreateElement } from 'vue';

export default Vue.extend({
  name: 'ts-component-extend',
  render(h: CreateElement) {
    return h('h3', 'extend in ts');
  },
});
