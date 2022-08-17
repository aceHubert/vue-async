import { AxiosRequestConfig } from 'axios';
import { RegistApiPlugin } from '@vue-async/fetch/types/vue/rootFetch';
import { RetryOptions } from '../types';
/**
 * register 'retry' only on regist apis (and custom condition)
 * @param options cache error options
 */
export declare const createRetryPlugin: (options?: RetryOptions & {
    runWhen?: (config: AxiosRequestConfig) => boolean;
}) => RegistApiPlugin;
