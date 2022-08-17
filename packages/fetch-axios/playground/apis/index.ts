import axios from 'axios';
import { ref } from 'vue-demi';
import { createFetch } from '@vue-async/fetch';
import { registLoading, registCatchError, registRetry } from '@vue-async/fetch-axios';

const axiosInstance = axios.create({
  timeout: 10000,
});

export const loadingRef = ref(false);
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

export const fetch = createFetch(axiosInstance);
