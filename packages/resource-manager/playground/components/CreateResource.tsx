import { defineComponent } from 'vue-demi';
import { createResource } from '@vue-async/resource-manager';

export default defineComponent({
  props: {
    message: String as PropType<string>,
  },
  setup(props) {
    const $dataRes = createResource(
      (time: number = 3) =>
        new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve(`data shows after ${time}s`);
          }, time * 1000);
        }),
    );

    let time = 3;
    $dataRes.read(time);

    return () => {
      const { $result: dataStr, $loading: dataLoading } = $dataRes;

      return (
        <div>
          {dataLoading ? (
            <p>loading...</p>
          ) : (
            <p>
              {props.message ? `${props.message}: ` : ''} {dataStr}
              <button type="button" style="display:block;" onClick={() => $dataRes.read(++time)}>
                reload
              </button>
            </p>
          )}
        </div>
      );
    };
  },
});
