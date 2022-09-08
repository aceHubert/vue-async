import warning from 'warning';
import axios from 'axios';
import { debug } from '../env';

// Types
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { CatchErrorOptions } from '../types';

const defaultOptions: CatchErrorOptions = {
  handler: (error: Error) => {
    warning(
      !debug,
      `Error is catched by default handler and stop propagation error out, Error message: ${error.message}`,
    );
    return new Promise(() => {});
  },
};

const isAxiosError = axios.isAxiosError;

function catchErrorHandler(error: AxiosError, options: CatchErrorOptions) {
  const { config } = error;
  if (!config?.catchError) return Promise.reject(error);
  return options.handler!(error);
}

/**
 * register catch error handler
 * @param axios axios instance
 * @param options catch error options
 * @param useOptions interceptor use options
 */
export function registCatchError(
  axios: AxiosInstance,
  options: CatchErrorOptions = {},
  runWhen: (config: AxiosRequestConfig) => boolean = () => true,
) {
  const curOptions = { ...defaultOptions, ...options };
  axios.interceptors.request.use(
    undefined,
    (error) => {
      if (!isAxiosError(error)) {
        warning(!debug, `catchError needs "AxiosError" config, please do not chage format from interceptors return! `);
        return Promise.reject(error);
      }

      return catchErrorHandler(error, curOptions);
    },
    { runWhen },
  );
  axios.interceptors.response.use(undefined, (error) => {
    if (!isAxiosError(error)) {
      warning(!debug, `catchError needs "AxiosError" config, please do not chage format from interceptors return! `);
      return Promise.reject(error);
    }
    // runWhen not works on response, https://github.com/axios/axios/issues/4792
    if (runWhen(error.config)) {
      return catchErrorHandler(error, curOptions);
    }
    return Promise.reject(error);
  });
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    catchError?: boolean;
  }
}

declare module '@vue-async/fetch/types/types' {
  export interface RequestConfig {
    /**
     * 启用异常全局处理，
     * 或通过Promise.catch捕获异常
     */
    catchError?: boolean;
  }
}
