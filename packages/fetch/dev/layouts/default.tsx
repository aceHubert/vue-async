import { defineComponent } from 'vue-demi';
import { FetchProvider, registApi } from '@vue-async/fetch';
import axios from 'axios';
import { apiConfig } from '../apis';

export default defineComponent({
  name: 'AxiosLayout',
  setup() {
    const axiosInstance = axios.create({
      timeout: 10000,
    });

    const prefix = 'http://localhost:7009';
    const api = registApi(axiosInstance, apiConfig, prefix);
    return () => (
      <div style="width:1000px;margin:auto;">
        <FetchProvider client={axiosInstance} api={api} prefix={prefix}>
          <nuxt />
        </FetchProvider>
      </div>
    );
  },
});
