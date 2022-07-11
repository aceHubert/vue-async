import warning from 'warning';
import { AxiosInstance, AxiosError } from 'axios';

export type RetryOptions = {
  /**
   * 最大重试试次数，默认值：3
   */
  maxCount?: number;
  /**
   * 重试延迟(formula(2 ^ c - 1 / 2) * 1000 毫秒数)，默认值：true
   */
  delay?: boolean;
  /**
   * 自定义重试条件，默认值：没有response返回并且错误信息为`Network Error`
   */
  validateError?: (error: AxiosError) => boolean;
};

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
        setTimeout(function () {
          resolve(null);
        }, backOffDelay);
      });

      // Return the promise in which recalls axios to retry the request
      return backoff.then(function () {
        warning(process.env.NODE_ENV === 'production', `${config.url}: retry ${config[RetryCountSymbol]} time(s)`);
        return axiosInstance(config);
      });
    }
  }

  return Promise.reject(error);
}

export function registRetry(axios: AxiosInstance, options: RetryOptions) {
  const curOptions = { ...defaultOptions, ...options };
  axios.interceptors.request.use(undefined, (error) => retryHandler(error, curOptions, axios));
  axios.interceptors.response.use(undefined, (error) => retryHandler(error, curOptions, axios));
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    retry?: boolean | RetryOptions;
    [RetryCountSymbol]?: number;
  }
}

// @ts-ignore
declare module '@vue-async/fetch' {
  export interface RequestConfig {
    retry?: boolean | RetryOptions;
  }
}
