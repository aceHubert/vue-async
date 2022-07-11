import { defineComponent, ref } from 'vue-demi';
import { FetchProvider, registApi } from '@vue-async/fetch';
import { registLoading, registCatchError, registRetry } from '@vue-async/fetch-axios';
import axios from 'axios';
import { apiConfig } from '../apis';

export default defineComponent({
  name: 'AxiosLayout',
  setup() {
    const axiosInstance = axios.create({
      timeout: 15000,
    });

    const loadingRef = ref(false);
    registLoading(axiosInstance, {
      handler: () => {
        loadingRef.value = true;
        return () => {
          loadingRef.value = false;
        };
      },
    });

    registCatchError(axiosInstance, {
      handler: (error: Error) => {
        alert(`global error handler: ${error.message}`);
        return new Promise(() => {});
      },
    });

    registRetry(axiosInstance, {
      maxCount: 5,
    });

    const prefix = 'http://localhost:7009';
    const api = registApi(axiosInstance, apiConfig, prefix);

    return () => (
      <div style="width:1000px;margin:auto;">
        <h1>axios helpers:</h1>
        {loadingRef.value && <p>Globle Loading...</p>}
        <FetchProvider client={axiosInstance} api={api} prefix={prefix}>
          <nuxt />
        </FetchProvider>
      </div>
    );
  },
});
