import { AxiosRequestConfig } from 'axios';
import { RegistApiPlugin } from '@vue-async/fetch';

declare module '@vue-async/fetch' {
  export interface RequestConfig<D = any> extends AxiosRequestConfig<D> {
    /**
     * 启用异常全局处理，
     * 或通过Promise.catch捕获异常
     */
    catchError?: boolean;
    /**
     * 启用加载，或自定义加载方法
     */
    loading?: boolean | LoadingHandler | Required<LoadingOptions>;
    /**
     * 启用重试，或自定义重试条件
     */
    retry?: boolean | RetryOptions;
  }
}

/**
 * catch error options
 */
export type CatchErrorOptions = {
  /**
   * Error 通过response.body 返回，
   * 返回 Promise.reject() 让异常返回到handler 中处理
   */
  serializerData?: <T = any, R = T>(data: T) => R | Promise<R>;
  /**
   * 全局 error catch 处理方法
   */
  handler?: (error: Error) => Promise<any>;
};

/**
 * loading handler, return unloading handler
 */
export type LoadingHandler = () => () => void;

/**
 * loading options
 */
export type LoadingOptions = {
  /**
   * 延迟调用处理方法毫秒数，默认值：260
   */
  delay?: number;
  /**
   * 全局 loading 处理方法
   */
  handler?: LoadingHandler;
};

/**
 * retry options
 */
export type RetryOptions = {
  /**
   * 最大重试试次数，默认值：3
   */
  maxCount?: number;
  /**
   * 重试延迟(formula(2 ^ c - 1 / 2) * 1000 毫秒数)，默认值：true
   */
  delay?: boolean;
  /**
   * 自定义重试条件，默认值：error.message 是 `Network Error`
   */
  validateError?: (error: Error) => boolean;
};

/**
 * plugin options
 */
type OptionsInPlugin<O extends Record<string, any>> = {
  /**
   * 插件执行的条件，默认是在所有通过 'defineRegistApi()' 的方法执行,
   * 可以以上条件上追加条件，如在某个前缀上执行等。
   */
  runWhen?: (config: AxiosRequestConfig) => boolean;
} & O;

/**
 * plugin definition for package '@vue-async/fetch'
 */
export interface PluginDefinition<O extends Record<string, any>> {
  (options?: OptionsInPlugin<O>): RegistApiPlugin;
}
