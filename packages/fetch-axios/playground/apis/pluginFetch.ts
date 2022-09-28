import axios from 'axios';
import { ref } from 'vue-demi';
import { createFetch } from '@vue-async/fetch';
import { createCatchErrorPlugin, createLoadingPlugin, createRetryPlugin } from '@vue-async/fetch-axios';

const axiosInstance = axios.create({
  timeout: 10000,
});

const pluginFetch = createFetch(axiosInstance);
pluginFetch.use(
  createCatchErrorPlugin({
    serializerData: (data: any) => {
      if (data.success !== void 0) {
        if (data.success) {
          return data.data;
        } else {
          return Promise.reject(new Error(data.message));
        }
      }
      return data;
    },
    handler: (error) => {
      if (
        axios.isAxiosError(error) &&
        Object.prototype.toString.call(error.response?.data) === '[object Object]' &&
        (error.response?.data as any).code === '400'
      ) {
        // http code error, and message from data
        alert(`global error handler from local plugin, ${(error.response?.data as any).message || ''}`);
      } else {
        alert(`global error handler from plugin: ${error.message}`);
      }
      return new Promise(() => {});
    },
  }),
);

export const loadingRef = ref(false);
pluginFetch.use(
  createLoadingPlugin({
    handler: () => {
      loadingRef.value = true;
      console.log('plugin', loadingRef.value);
      return () => {
        loadingRef.value = false;
      };
    },
  }),
);

pluginFetch.use(
  createRetryPlugin({
    maxCount: 5,
  }),
);

export { pluginFetch };
