import { defineComponent } from 'vue-demi';
import { AsyncComponent } from '../components/AsyncComponent';

export default defineComponent({
  name: 'RemoteComponent',
  setup() {
    return () => (
      <div>
        <h3>页面中加载远端组件</h3>
        <AsyncComponent />
      </div>
    );
  },
});
