import { registCatchError } from '../core';

// Types
import { AxiosInstance } from 'axios';
import { CatchErrorOptions, PluginDefinition } from '../types';

/**
 * 注册异常处理插件
 * 只在regist apis上运行 (and 自定义条件下)
 * @param options 插件配置
 */
export const createCatchErrorPlugin: PluginDefinition<CatchErrorOptions> = ({
  runWhen = () => true,
  ...catchErrorOptions
} = {}) => ({ id, fetch }) => {
  registCatchError(fetch.client as AxiosInstance, catchErrorOptions, (config) => {
    return (
      !!config._registId &&
      id === config._registId && // 只对 regist api 生效
      runWhen(config) // 自定义条件
    );
  });
};
