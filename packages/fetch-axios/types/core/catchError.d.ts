import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { CatchErrorOptions } from '../types';
/**
 * register catch error handler
 * @param axios axios instance
 * @param options catch error options
 * @param useOptions interceptor use options
 */
export declare function registCatchError(axios: AxiosInstance, options?: CatchErrorOptions, runWhen?: (config: AxiosRequestConfig) => boolean): void;
declare module 'axios' {
    interface AxiosRequestConfig {
        catchError?: boolean;
    }
}
declare module '@vue-async/fetch/types/types' {
    interface RequestConfig {
        catchError?: boolean;
    }
}
