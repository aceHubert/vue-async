import { defineComponent } from 'vue-demi';
import './styles/pageB.less';

export default defineComponent({
  name: 'pageB',
  setup() {
    return () => (
      <div class="page-b">
        <h1 class="title">Page B</h1>
        <router-link to="/">to index</router-link>
      </div>
    );
  },
});
