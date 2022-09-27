import { registRetry } from '../core';

// Types
import { RetryOptions, PluginDefinition } from '../types';

/**
 * 注册重试插件
 * 只在regist apis上运行 (and 自定义条件下)
 * @param options 插件配置
 */
export const createRetryPlugin: PluginDefinition<RetryOptions> =
  (options = {}) =>
  ({ registApis }) => {
    return Object.keys(registApis).reduce((prev, key) => {
      prev[key] = registRetry(registApis[key], options);
      return prev;
    }, {} as Record<string, Function>);
  };
