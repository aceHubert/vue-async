import { registRetry } from '../core';

// Types
import { AxiosInstance } from 'axios';
import { RetryOptions, PluginDefinition } from '../types';

/**
 * register 'retry' only on regist apis (and custom condition)
 * @param options cache error options
 */
export const createRetryPlugin: PluginDefinition<RetryOptions> = ({ runWhen = () => true, ...retryOptions } = {}) => ({
  id,
  fetch,
}) => {
  registRetry(fetch.client as AxiosInstance, retryOptions, (config) => {
    return (
      !!config._registId &&
      id === config._registId && // 只对 regist api 生效
      runWhen(config) // 自定义条件
    );
  });
};
