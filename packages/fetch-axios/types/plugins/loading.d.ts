import { AxiosRequestConfig } from 'axios';
import { RegistApiPlugin } from '@vue-async/fetch/types/vue/rootFetch';
import { LoadingOptions } from '../types';
/**
 * register 'loading' only on regist apis (and custom condition)
 * @param options cache error options
 */
export declare const createLoadingPlugin: (options?: LoadingOptions & {
    runWhen?: (config: AxiosRequestConfig) => boolean;
}) => RegistApiPlugin;
