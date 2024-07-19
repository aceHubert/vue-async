import { defineComponent } from 'vue-demi';
import { createResource } from '@vue-async/resource-manager';

export default defineComponent({
  props: ['message'],
  setup(props) {
    const dataStr = ref('');
    const $dataRes = createResource(
      (time = 3) =>
        new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve(`data shows after ${time}s`);
          }, time * 1000);
        }),
    );

    $dataRes.read(6).then((data) => {
      dataStr.value = data;
    });

    return () => {
      return (
        <p>
          {props.message ? `${props.message}: ` : ''} {dataStr.value}
        </p>
      );
    };
  },
});
