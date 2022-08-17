import { registRetry } from '../core';

// Types
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RegistApiPlugin } from '@vue-async/fetch/types/vue/rootFetch';
import { RetryOptions } from '../types';

/**
 * register 'retry' only on regist apis (and custom condition)
 * @param options cache error options
 */
export const createRetryPlugin: (
  options?: RetryOptions & { runWhen?: (config: AxiosRequestConfig) => boolean },
) => RegistApiPlugin =
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
