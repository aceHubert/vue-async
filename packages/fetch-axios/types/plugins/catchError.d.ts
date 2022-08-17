import { AxiosRequestConfig } from 'axios';
import { RegistApiPlugin } from '@vue-async/fetch/types/vue/rootFetch';
import { CatchErrorOptions } from '../types';
/**
 * register 'cacheError' only on regist apis (and custom condition)
 * @param options cache error options
 */
export declare const createCatchErrorPlugin: (options?: CatchErrorOptions & {
    runWhen?: (config: AxiosRequestConfig) => boolean;
}) => RegistApiPlugin;
