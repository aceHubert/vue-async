import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { RetryOptions } from '../types';
export declare const RetryCountSymbol = '__RetryCount__';
/**
 * register retry handler
 * @param axios axios instance
 * @param options retry options
 * @param useOptions interceptor use options
 */
export declare function registRetry(
  axios: AxiosInstance,
  options: RetryOptions,
  runWhen?: (config: AxiosRequestConfig) => boolean,
): void;
declare module 'axios' {
  interface AxiosRequestConfig {
    retry?: boolean | RetryOptions;
    [RetryCountSymbol]?: number;
  }
}
declare module '@vue-async/fetch/types/types' {
  interface RequestConfig {
    retry?: boolean | RetryOptions;
  }
}
