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
    );

    let time = 3;
    $dataRes.read(time);

    return () => {
      const { $result: dataStr, $loading: loading } = $dataRes;

      return (
        <p>
          {props.message ? `${props.message}: ` : ''} {dataStr}
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              $dataRes.$result = '';
              $dataRes.read(++time);
            }}
          >
            reload
          </button>
        </p>
      );
    };
  },
});
