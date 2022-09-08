import warning from 'warning';
import { debug } from '../env';

// Types
import { AxiosInstance } from 'axios';
import { PluginDefinition, ValidResponseOptions } from '../types';

/**
 * 注册验证response.data插件（例如RestApi中使用返回对象作为接口成功或失败条件）
 * 只在regist apis上运行 (and 自定义条件下)
 * @param options 插件配置
 */
export const createValidResponsePlugin: PluginDefinition<ValidResponseOptions> = ({
  runWhen = () => true,
  validate = () => true,
} = {}) => ({ id, fetch }) => {
  const client = fetch.client as AxiosInstance;
  client.interceptors.response.use((response) => {
    if (!response?.config) {
      warning(!debug, `loading needs "response" config, please do not chage format from interceptors return! `);
      return response;
    }
    // runWhen not works on response, https://github.com/axios/axios/issues/4792
    if (
      !!response.config._registId &&
      id === response.config._registId && // 只对 regist api 生效
      runWhen(response.config) // 自定义条件
    ) {
      const result = validate(response.data);
      if (result !== true) {
        // throw to catchError plugin or custom interceptors error handler
        // format to AxisoError 
        return Promise.reject({
          isAxiosError: true,
          config: response.config,
          request: response.request,
          response,
          ...result,
        });
      }
    }
    return response;
  }, undefined);
};
