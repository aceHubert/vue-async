import { defineComponent, ref } from 'vue-demi';
import './styles/pageA.less';

export default defineComponent({
  name: 'pageA',
  setup() {
    const timer = ref(0);
    const interval = 1000;
    const tick = () => {
      timer.value++;
    };
    setInterval(tick, interval);

    return () => (
      <div class="page-a">
        <h3>F5 to refresh the page</h3>
        <h1 class="title">Page A</h1>
        <p>Timer: {timer.value}</p>
        <router-link to={{ name: 'dymanic-page-b' }}>to pageB</router-link>
      </div>
    );
  },
});
