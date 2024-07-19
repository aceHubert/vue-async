import { defineComponent, getCurrentInstance } from 'vue-demi';
import { Suspense, setSuspenseOptions } from '@vue-async/resource-manager';
import Load3s from '../components/Load3s';
import Load6s from '../components/Load6s';
import Suspensible from '~/components/Suspensible';

export default defineComponent({
  setup() {
    const instance = getCurrentInstance();

    const visible = ref(false);
    const times = ref(0);

    onMounted(() => {
      setInterval(() => {
        times.value++;
        if (times.value === 100) {
          times.value = 0;
        }
      }, 1000);
    });

    const eventStatus = ref('');
    const eventStatus2 = ref('');

    setSuspenseOptions({ mode: visible.value ? 'visible' : 'hidden' });

    const handleVisible = (e: any) => {
      visible.value = e.target.checked;
      setSuspenseOptions({ mode: visible.value ? 'visible' : 'hidden' });
      instance?.proxy?.$forceUpdate();
    };

    return () => {
      return (
        <div id="app">
          <p>(times:{times.value}s)</p>
          <div>
            <h2 style="display: inline-block;">Suspense:</h2>
            <label style="margin-left: 10px;">
              <input type="checkbox" checked={visible.value} onChange={handleVisible} />
              mode: {visible.value ? 'visible' : 'hidden'}
            </label>
            <p style="font-weight: bold;">Lazy load (status: {eventStatus.value})</p>

            <Suspense
              onPending={() => (eventStatus.value = 'pending')}
              onResolve={() => (eventStatus.value = 'resolve')}
            >
              {{
                default: () => (
                  <>
                    <Load3s message="Suspense1" />
                    <Load6s message="Suspense1" />
                  </>
                ),
                fallback: () => <p>loading1...</p>,
              }}
            </Suspense>
            <Suspense>
              {{
                default: () => (
                  <>
                    <Load3s message="Suspense2" />
                    <Suspensible message="Suspense2(suspensible: false)" />
                  </>
                ),
                fallback: () => <p>loading2...</p>,
              }}
            </Suspense>
            <p style="font-weight: bold;">No createResource (status: {eventStatus2.value})</p>
            <Suspense
              onPending={() => (eventStatus2.value = 'pending')}
              onResolve={() => (eventStatus2.value = 'resolve')}
            >
              {{
                default: () => <p>A textbox</p>,
                fallback: () => <p>loading3...</p>,
              }}
            </Suspense>
          </div>
        </div>
      );
    };
  },
});
