import { RetryOptions, PluginDefinition } from '../types';
/**
 * register 'retry' only on regist apis (and custom condition)
 * @param options cache error options
 */
export declare const createRetryPlugin: PluginDefinition<RetryOptions>;
