import warning from 'warning';
import axios from 'axios';
import { debug } from '../env';

// types
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { RetryOptions } from '../types';

// axios mergeConig does not support Symbol (Object.keys())
export const RetryCountSymbol = '__RetryCount__';

const defaultOptions: RetryOptions = {
  maxCount: 3,
  delay: true,
  /**
   * The request was made but no response was received
   * `error.request` is an instance of XMLHttpRequest in the browser and an instance of
   * http.ClientRequest in node.js
   */
  validateError: (error) => !error.response && !!error.request && error.message === 'Network Error',
};

const isAxiosError = axios.isAxiosError;

function retryHandler(error: AxiosError, options: RetryOptions, axiosInstance: AxiosInstance) {
  const config = error.config;
  if (!!config?.retry) {
    const curOptions = typeof config.retry === 'boolean' ? options : { ...options, ...config.retry };
    if (!curOptions.validateError!(error)) return Promise.reject(error);

    // Set the variable for keeping track of the retry count
    config[RetryCountSymbol] = config[RetryCountSymbol] || 0;

    // Check if we've maxed out the total number of retries
    if (config[RetryCountSymbol]! < curOptions.maxCount!) {
      // Increase the retry count
      config[RetryCountSymbol]! += 1;

      // Create new promise to handle exponential backoff.
      // formula(2 ^ c - 1 / 2) * 1000(for mS to seconds)
      const backoff = new Promise(function (resolve) {
        const backOffDelay = curOptions.delay ? (1 / 2) * (Math.pow(2, config[RetryCountSymbol]!) - 1) * 1000 : 1;
        warning(!debug, `${config.url}: retry delay ${backOffDelay}ms`);
        setTimeout(function () {
          resolve(null);
        }, backOffDelay);
      });

      // Return the promise in which recalls axios to retry the request
      return backoff.then(function () {
        warning(!debug, `${config.url}: retry ${config[RetryCountSymbol]} time(s)`);
        return axiosInstance(config);
      });
    }
  }

  return Promise.reject(error);
}

/**
 * register retry handler
 * @param axios axios instance
 * @param options retry options
 * @param useOptions interceptor use options
 */
export function registRetry(
  axios: AxiosInstance,
  options: RetryOptions,
  runWhen: (config: AxiosRequestConfig) => boolean = () => true,
) {
  const curOptions = { ...defaultOptions, ...options };
  axios.interceptors.request.use(
    undefined,
    (error) => {
      if (!isAxiosError(error)) {
        warning(!debug, `retry needs "AxiosError" config, please do not chage format from interceptors return! `);
        return Promise.reject(error);
      }

      return retryHandler(error, curOptions, axios);
    },
    { runWhen },
  );
  axios.interceptors.response.use(undefined, (error) => {
    if (!isAxiosError(error)) {
      warning(!debug, `retry needs "AxiosError" config, please do not chage format from interceptors return! `);
      return Promise.reject(error);
    }
    // runWhen not works on response, https://github.com/axios/axios/issues/4792
    return runWhen(error.config) ? retryHandler(error, curOptions, axios) : Promise.reject(error);
  });
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    retry?: boolean | RetryOptions;
    [RetryCountSymbol]?: number;
  }
}

declare module '@vue-async/fetch/types/types' {
  export interface RequestConfig {
    /**
     * 启用重试，或自定义重试条件
     */
    retry?: boolean | RetryOptions;
  }
}
