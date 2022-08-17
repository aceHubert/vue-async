import { registLoading } from '../core';

// Types
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RegistApiPlugin } from '@vue-async/fetch/types/vue/rootFetch';
import { LoadingOptions } from '../types';

/**
 * register 'loading' only on regist apis (and custom condition)
 * @param options cache error options
 */
export const createLoadingPlugin: (
  options?: LoadingOptions & { runWhen?: (config: AxiosRequestConfig) => boolean },
) => RegistApiPlugin =
  ({ runWhen = () => true, ...loadingOptions } = {}) =>
  ({ fetch, options: { apis, prefix } }) => {
    const registIds = Object.keys(apis).map((methodName) => `${prefix}/${methodName}`);
    registLoading(fetch.client as AxiosInstance, loadingOptions, {
      runWhen: (config) => {
        return (
          !!config._registId &&
          registIds.includes(config._registId) && // 只对 regist api 生效
          runWhen(config) // 自定义条件
        );
      },
    });
  };
