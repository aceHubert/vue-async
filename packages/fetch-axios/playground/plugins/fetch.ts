import { defineNuxtPlugin } from 'nuxt/app';
import { ref } from 'vue-demi';
import { createFetch, setActiveFetch } from '@vue-async/fetch';
import { registLoading, registCatchError, registRetry } from '@vue-async/fetch-axios';
import axios from 'axios';
import { apiConfig } from '../apis';

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    timeout: 10000,
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
  const fetch = createFetch(axiosInstance, {
    apis: apiConfig,
    prefix,
  });

  nuxtApp.vueApp.use(fetch);
  nuxtApp.vueApp.provide('serverBaseUrl', prefix);
  nuxtApp.vueApp.provide('requestLoading', loadingRef);
  setActiveFetch(fetch);
});
