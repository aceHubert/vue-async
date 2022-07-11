import { AxiosInstance } from 'axios';
export declare type LoadingHandler = () => () => void;
export declare type LoadingOptions = {
  /**
   * 延迟调用处理方法毫秒数，默认值：260
   */
  delay?: number;
  /**
   * 全局 loading 处理方法
   */
  handler?: LoadingHandler;
};
export declare const StopLoadingFnSymbol = '__StopLoading__';
export declare const ResponseFinishedSymbol = '__LoadingResponseFinished__';
export declare function registLoading(axios: AxiosInstance, options: LoadingOptions): void;
declare module 'axios' {
  interface AxiosRequestConfig {
    loading?: boolean | LoadingHandler;
    [StopLoadingFnSymbol]?: typeof ResponseFinishedSymbol | ReturnType<LoadingHandler>;
  }
}
declare module '@vue-async/fetch' {
  interface RequestConfig {
    loading?: boolean | LoadingHandler;
  }
}
