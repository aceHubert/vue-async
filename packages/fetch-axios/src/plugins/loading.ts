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
  ({ id, fetch }) => {
    registLoading(fetch.client as AxiosInstance, loadingOptions, (config) => {
      return (
        !!config._registId &&
        id === config._registId && // 只对 regist api 生效
        runWhen(config) // 自定义条件
      );
    });
  };
