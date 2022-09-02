import {
  AxiosRequestConfig,
  AxiosRequestTransformer,
  AxiosResponseTransformer,
  AxiosAdapter,
  AxiosBasicCredentials,
  AxiosProxyConfig,
  CancelToken,
  TransitionalOptions,
  AxiosError,
} from 'axios';
import { RegistApiPlugin } from '@vue-async/fetch/types/vue/rootFetch';

/**
 * @internal
 */
declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * From 'registApi' unique id
     */
    _registId?: string;
  }
}

declare module '@vue-async/fetch/types/types' {
  export interface RequestConfig {
    transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
    transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    paramsSerializer?: (params: any) => string;
    adapter?: AxiosAdapter;
    auth?: AxiosBasicCredentials;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    maxBodyLength?: number;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    proxy?: AxiosProxyConfig | false;
    cancelToken?: CancelToken;
    decompress?: boolean;
    transitional?: TransitionalOptions;
  }
}

/**
 * catch error options
 */
export type CatchErrorOptions = {
  /**
   * 全局 error catch 处理方法
   */
  handler?: (err: AxiosError) => Promise<any>;
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
   * 自定义重试条件，默认值：没有response返回并且错误信息为`Network Error`
   */
  validateError?: (error: AxiosError) => boolean;
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
