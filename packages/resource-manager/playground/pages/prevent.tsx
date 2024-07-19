import { defineComponent } from 'vue-demi';
import { Suspense, setSuspenseOptions } from '@vue-async/resource-manager';
import Prevent from '../components/Prevent';

export default defineComponent({
  setup() {
    const { $resourceManager } = useNuxtApp();

    const times = ref(0);

    onMounted(() => {
      setInterval(() => {
        times.value++;
        if (times.value === 100) {
          times.value = 0;
        }
      }, 1000);
    });

    setSuspenseOptions({ mode: 'visible' });

    return () => {
      return (
        <div id="app">
          <p>(times:{times.value}s)</p>
          <div>
            <h2>Suspense:</h2>
            <p style="font-weight: bold;">prevent: true</p>
            <Suspense>
              {{
                default: () => (
                  <>
                    <Prevent message="Result" />
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
