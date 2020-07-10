import Playground from './Playground';
import DynamicComponent from './DynamicComponent';

export default Vue.extend({
  name: 'App',
  created() {
    this.$dynamicComponent.add(DynamicComponent, 'dynamic');
  },
  render(h) {
    return h('div', { domProps: { id: 'app' } }, [h(Playground)]);
  },
});
