import { defineComponent } from 'vue-demi';
import classes from './index.module.less';

export default defineComponent({
  name: 'pageA',
  setup() {
    return () => <h1 class={classes.title}>Remote Commponent A</h1>;
  },
});
