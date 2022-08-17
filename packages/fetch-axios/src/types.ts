import {
  AxiosRequestTransformer,
  AxiosResponseTransformer,
  AxiosAdapter,
  AxiosBasicCredentials,
  AxiosProxyConfig,
  CancelToken,
  TransitionalOptions,
  AxiosError
} from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * From 'registApi' unique id, format to `{prefix}/{methodName}`
     * @internal
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
  handler?: (err: Error) => Promise<any>;
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
