import { registLoading } from '../core';

// Types
import { AxiosInstance } from 'axios';
import { LoadingOptions, PluginDefinition } from '../types';

/**
 * 注入加载中插件
 * 只在regist apis上运行 (and 自定义条件下)
 * @param options 插件配置
 */
export const createLoadingPlugin: PluginDefinition<LoadingOptions> = ({
  runWhen = () => true,
  ...loadingOptions
} = {}) => ({ id, fetch }) => {
  registLoading(fetch.client as AxiosInstance, loadingOptions, (config) => {
    return (
      !!config._registId &&
      id === config._registId && // 只对 regist api 生效
      runWhen(config) // 自定义条件
    );
  });
};
