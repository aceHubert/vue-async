import axios from 'axios';
import { createFetch } from '@vue-async/fetch';

const axiosInstance = axios.create({
  timeout: 10000,
});

export const fetch = createFetch(axiosInstance);
