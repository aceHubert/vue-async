import _Vue from 'vue';

import PluginA from './components/pluginA';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (this: any, Vue: _Vue) {
  this.$dynamicComponent.add(
    { component: PluginA, title: 'TS-Plugin', index: -1, cols: 12, type: 'none' },
    'dashboard',
  );
}
