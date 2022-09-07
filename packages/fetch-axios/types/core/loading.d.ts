import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { LoadingHandler, LoadingOptions } from '../types';
export declare const StopLoadingFnSymbol = '__StopLoading__';
export declare const ResponseFinishedSymbol = '__LoadingResponseFinished__';
/**
 * register loading handler
 * @param axios axios instance
 * @param options loading options
 * @param useOptions interceptor use options
 */
export declare function registLoading(
  axios: AxiosInstance,
  options: LoadingOptions,
  runWhen?: (config: AxiosRequestConfig) => boolean,
): void;
declare module 'axios' {
  interface AxiosRequestConfig {
    loading?: boolean | LoadingHandler | Required<LoadingOptions>;
    [StopLoadingFnSymbol]?: typeof ResponseFinishedSymbol | ReturnType<LoadingHandler>;
  }
}
declare module '@vue-async/fetch/types/types' {
  interface RequestConfig {
    loading?: boolean | LoadingHandler | Required<LoadingOptions>;
  }
}
