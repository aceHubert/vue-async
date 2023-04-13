// dashboard

import Vue from 'vue';
import Vuex from 'vuex';

export default Vue.extend({
  name: 'Playground',
  computed: Vuex.mapState('moduleJS', ['index']),
  render(h) {
    return h('div', { staticClass: 'playground' }, [
      h(
        'router-link',
        { staticStyle: { margin: '0 10px 5px', display: 'block' }, props: { to: { name: 'dymanic-page-a' } } },
        'Remote Page A',
      ),
      h(
        'router-link',
        { staticStyle: { margin: '0 10px 5px', display: 'block' }, props: { to: { name: 'remote-component-a' } } },
        'Remote Component A as router component',
      ),
      h(
        'router-link',
        { staticStyle: { margin: '0 10px 5px', display: 'block' }, props: { to: { name: 'wrong-component-name' } } },
        'setted wrong component name',
      ),
      h(
        'router-link',
        { staticStyle: { margin: '0 10px 5px', display: 'block' }, props: { to: { name: 'wrong-component-entry' } } },
        'setted wrong component entry',
      ),
      h(
        'router-link',
        { staticStyle: { margin: '0 10px 5px', display: 'block' }, props: { to: { name: 'component-loading' } } },
        'async component in 3s',
      ),
    ]);
  },
});
