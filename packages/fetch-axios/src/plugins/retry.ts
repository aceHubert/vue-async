import { registRetry } from '../core';

// Types
import { AxiosInstance } from 'axios';
import { RetryOptions, PluginDefinition } from '../types';

/**
 * register 'retry' only on regist apis (and custom condition)
 * @param options cache error options
 */
export const createRetryPlugin: PluginDefinition<RetryOptions> =
  ({ runWhen = () => true, ...retryOptions } = {}) =>
  ({ fetch, options: { apis, prefix } }) => {
    const registIds = Object.keys(apis).map((methodName) => `${prefix}/${methodName}`);
    registRetry(fetch.client as AxiosInstance, retryOptions, {
      runWhen: (config) => {
        return (
          !!config._registId &&
          registIds.includes(config._registId) && // 只对 regist api 生效
          runWhen(config) // 自定义条件
        );
      },
    });
  };
