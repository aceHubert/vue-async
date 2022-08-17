import warning from 'warning';
import { debug } from '../env';

// Types
import type { AxiosInstance, AxiosError, AxiosInterceptorOptions } from 'axios';
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
  useOptions?: AxiosInterceptorOptions,
) {
  const curOptions = { ...defaultOptions, ...options };
  axios.interceptors.request.use(undefined, (error) => catchErrorHandler(error, curOptions), useOptions);
  axios.interceptors.response.use(undefined, (error) => catchErrorHandler(error, curOptions), useOptions);
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    catchError?: boolean;
  }
}

declare module '@vue-async/fetch/types/types' {
  export interface RequestConfig {
    catchError?: boolean;
  }
}
