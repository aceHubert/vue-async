import warning from 'warning';
import type { AxiosInstance, AxiosError } from 'axios';
import { debug } from './env';

export type CatchErrorOptions = {
  /**
   * 全局 error catch 处理方法
   */
  handler?: (err: Error) => Promise<any>;
};

const defaultOptions: CatchErrorOptions = {
  handler: (error: Error) => {
    warning(
      !debug,
      `Error is catched by default handler and stop propagation error out, Error message: ${error.message}`,
    );
    return new Promise(() => {});
  },
};

function catchErrorHandler(error: AxiosError, options: CatchErrorOptions) {
  const { config } = error;
  if (!config?.catchError) return Promise.reject(error);
  return options.handler!(error);
}

export function registCatchError(axios: AxiosInstance, options: CatchErrorOptions = {}) {
  const curOptions = { ...defaultOptions, ...options };
  axios.interceptors.request.use(undefined, (error) => catchErrorHandler(error, curOptions));
  axios.interceptors.response.use(undefined, (error) => catchErrorHandler(error, curOptions));
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    catchError?: boolean;
  }
}

// @ts-ignore
declare module '@vue-async/fetch' {
  export interface RequestConfig {
    catchError?: boolean;
  }
}
