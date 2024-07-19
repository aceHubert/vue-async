import { defineComponent } from 'vue-demi';
import { Suspense, setSuspenseOptions } from '@vue-async/resource-manager';
import Load3s from '../components/Load3s';
import Suspensible from '../components/Suspensible';

export default defineComponent({
  setup() {
    const times = ref(0);

    onMounted(() => {
      setInterval(() => {
        times.value++;
        if (times.value === 100) {
          times.value = 0;
        }
      }, 1000);
    });

    setSuspenseOptions({ mode: 'hidden' });

    return () => {
      return (
        <div id="app">
          <p>(times:{times.value}s)</p>
          <div>
            <h2>Suspense:</h2>
            <p style="font-weight: bold;">suspensible: false</p>
            <Suspense>
              {{
                default: () => (
                  <>
                    <Load3s message="Result" />
                    <Suspensible message="Result(suspensible: false)" />
                  </>
                ),
                fallback: () => <p>loading...</p>,
              }}
            </Suspense>
          </div>
        </div>
      );
    };
  },
});
