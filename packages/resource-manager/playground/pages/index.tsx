import { defineComponent } from 'vue-demi';
import CreateResource from '../components/CreateResource';

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

    return () => {
      return (
        <div id="app">
          <p>(times:{times.value}s)</p>
          <div>
            <h2>createResource:</h2>
            <CreateResource message="CreateResource" />
          </div>
          <div>
            <h2>Suspense:</h2>
            <p>
              <nuxt-link to={{ name: 'suspense' }}>Suspense</nuxt-link>
            </p>
            <p>
              <nuxt-link to={{ name: 'suspensible' }}>Suspense suspensible</nuxt-link>
            </p>
            <p>
              <nuxt-link to={{ name: 'prevent' }}>Suspense prevent</nuxt-link>
            </p>
          </div>
        </div>
      );
    };
  },
});
