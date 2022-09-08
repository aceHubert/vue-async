import { registRetry } from '../core';

// Types
import { AxiosInstance } from 'axios';
import { RetryOptions, PluginDefinition } from '../types';

/**
 * 注册重试插件
 * 只在regist apis上运行 (and 自定义条件下)
 * @param options 插件配置
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
