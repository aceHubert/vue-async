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
    handler: (error) => {
      alert(`global error handler from plugin: ${error.message}`);
      return new Promise(() => {});
    },
  }),
);

export const loadingRef = ref(false);
pluginFetch.use(
  createLoadingPlugin({
    handler: () => {
      loadingRef.value = true;
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
