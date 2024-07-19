import { defineComponent } from 'vue-demi';
import { createResource } from '@vue-async/resource-manager';

export default defineComponent({
  props: ['message'],
  setup(props) {
    const $dataRes = createResource(
      (time = 3) =>
        new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve(`data shows after ${time}s`);
          }, time * 1000);
        }),
      { suspensible: false },
    );

    $dataRes.read(6);

    return () => {
      const { $result: dataStr } = $dataRes;

      return (
        <p>
          {props.message ? `${props.message}: ` : ''} {dataStr}
        </p>
      );
    };
  },
});
