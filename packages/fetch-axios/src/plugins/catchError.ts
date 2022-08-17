import { registCatchError } from '../core';

// Types
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RegistApiPlugin } from '@vue-async/fetch/types/vue/rootFetch';
import { CatchErrorOptions } from '../types';

/**
 * register 'cacheError' only on regist apis (and custom condition)
 * @param options cache error options
 */
export const createCatchErrorPlugin: (
  options?: CatchErrorOptions & { runWhen?: (config: AxiosRequestConfig) => boolean },
) => RegistApiPlugin =
  ({ runWhen = () => true, ...catchErrorOptions } = {}) =>
  ({ fetch, options: { apis, prefix } }) => {
    const registIds = Object.keys(apis).map((methodName) => `${prefix}/${methodName}`);
    registCatchError(fetch.client as AxiosInstance, catchErrorOptions, {
      runWhen: (config) => {
        return (
          !!config._registId &&
          registIds.includes(config._registId) && // 只对 regist api 生效
          runWhen(config) // 自定义条件
        );
      },
    });
  };
