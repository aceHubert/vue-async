import { VueConstructor } from 'vue';

import componentA from './components/componentA';
import componentExtend from './components/extend';

export default function (this: InstanceType<VueConstructor>, _Vue: VueConstructor) {
  this.$dynamicComponent.add(
    { component: componentA, title: 'TS-Plugin-A', index: -1, cols: 12, type: 'none' },
    'dashboard',
  );
  this.$dynamicComponent.add(
    {
      component: componentExtend,
      title: 'TS-Plugin-Extend',
      index: -1,
      cols: 12,
      type: 'none',
    },
    'dashboard',
  );
}
