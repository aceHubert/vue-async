import { registLoading } from '../core';

// Types
import { AxiosInstance } from 'axios';
import { LoadingOptions, PluginDefinition } from '../types';

/**
 * register 'loading' only on regist apis (and custom condition)
 * @param options cache error options
 */
export const createLoadingPlugin: PluginDefinition<LoadingOptions> =
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
