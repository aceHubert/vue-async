import { defineComponent, ref } from 'vue-demi';
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
      { prevent: true },
    );

    const messages = ref<string[]>([]);
    let times = 6;

    $dataRes.read(times);
    messages.value.push(`first time: params ${times}`);

    setTimeout(() => {
      $dataRes.read(++times);
      messages.value.push(`second time(3s later): prspms ${times}`);
    }, 3000);

    return () => {
      const { $result: dataStr } = $dataRes;

      return (
        <>
          {messages.value.map((msg) => (
            <p>{msg}</p>
          ))}
          <p>
            {props.message ? `${props.message}: ` : ''} {dataStr}
          </p>
        </>
      );
    };
  },
});
