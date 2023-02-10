import { defineComponent, ref } from 'vue-demi';
import { FetchProvider, registApi } from '@vue-async/fetch';
import { registLoading, registCatchError, registRetry } from '@vue-async/fetch-cross-fetch';
import fetch from 'cross-fetch';
import { apiConfig } from '../apis';

export default defineComponent({
  name: 'AxiosLayout',
  setup() {
    const fetchInstance = fetch;

    const loadingRef = ref(false);
    registLoading(fetchInstance, {
      handler: () => {
        loadingRef.value = true;
        return () => {
          loadingRef.value = false;
        };
      },
    });

    registCatchError(fetchInstance, {
      handler: (error: Error) => {
        alert(`global error handler: ${error.message}`);
        return new Promise(() => {});
      },
    });

    registRetry(fetchInstance, {
      maxCount: 5,
    });

    const prefix = 'http://localhost:7009';
    const api = registApi(fetchInstance, apiConfig, prefix);

    return () => (
      <div style="width:1000px;margin:auto;">
        <h1>cross-fetch helpers:</h1>
        {loadingRef.value && <p>Globle Loading...</p>}
        <FetchProvider client={fetchInstance} api={api} prefix={prefix}>
          <nuxt />
        </FetchProvider>
      </div>
    );
  },
});
