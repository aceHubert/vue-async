import { AxiosInstance } from 'axios';
export declare type CatchErrorOptions = {
  /**
   * 全局 error catch 处理方法
   */
  handler?: (err: Error) => Promise<any>;
};
export declare function registCatchError(axios: AxiosInstance, options?: CatchErrorOptions): void;
declare module 'axios' {
  interface AxiosRequestConfig {
    catchError?: boolean;
  }
}
declare module '@vue-async/fetch' {
  interface RequestConfig {
    catchError?: boolean;
  }
}
