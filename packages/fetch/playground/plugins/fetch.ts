import { defineNuxtPlugin } from 'nuxt/app';
import { createFetch, setActiveFetch } from '@vue-async/fetch';
import axios from 'axios';
import { apiConfig } from '../apis';

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    timeout: 10000,
  });

  const prefix = 'http://localhost:7009';
  const fetch = createFetch(axiosInstance, {
    apis: apiConfig,
    prefix,
  });

  nuxtApp.vueApp.use(fetch);
  nuxtApp.vueApp.provide('serverBaseUrl', prefix);
  setActiveFetch(fetch);
});
