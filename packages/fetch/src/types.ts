/* eslint-disable @typescript-eslint/no-empty-interface */
import * as VueDemi from 'vue-demi';

class Helper<Props> {
  Return = VueDemi.defineComponent({} as { props: Record<keyof Props, any> });
}

export type DefineComponent<Props> = Helper<Props>['Return'];

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

export type RequestType = 'json' | 'form';

export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export interface RequestConfig {
  url?: string;
  method?: Method;
  headers?: any;
  params?: any;
  data?: any;
  // 请求的的数据类型 json / form(x-www-form-urlencoded)
  requestType?: RequestType;
  responseType?: ResponseType;
  validateStatus?: ((status: number) => boolean) | null;
}

export interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: RequestConfig;
  request?: any;
}

export interface AjaxPromise<T = any> extends Promise<Response<T>> {}

export interface Client {
  (config: RequestConfig): AjaxPromise;
  (url: string, config?: RequestConfig): AjaxPromise;

  request<T = any, R = Response<T>>(config: RequestConfig): Promise<R>;
  get<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
  delete<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
  head<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
  options<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
  post<T = any, R = Response<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
  put<T = any, R = Response<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
  patch<T = any, R = Response<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
}

export type MethodUrl = string | MethodUrlWithConfig | MethodUrlFn;
export type MethodUrlWithConfig = [Partial<RequestConfig>, string];
export type MethodUrlFn<R = any, P = any, D = any> = (params: P) => string | MethodUrlWithConfig;

/**
 * type isNever = CheckNever<any> => 'yes' | 'no'
 * type isNever = CheckNever<never> => never
 */
type CheckNever<T> = T extends never ? 'yes' : 'no';
/**
 * type isAny = CheckAny<any> => 'yes'
 * type isAny = CheckAny<never> => 'no'
 */
type CheckAny<T> = CheckNever<T> extends 'no' ? 'no' : 'yes';

export type TransApiResult<MethodUrl> = MethodUrl extends MethodUrlFn<infer Result, infer Params, infer Data>
  ? CheckAny<Params> extends 'yes'
    ? (
        config?: Partial<Omit<RequestConfig, 'params' | 'data'> & { params?: Params; data?: Data }>,
      ) => AjaxPromise<Result>
    : (config: Partial<Omit<RequestConfig, 'params' | 'data'>> & { params: Params; data?: Data }) => AjaxPromise<Result>
  : (config?: Partial<RequestConfig>) => AjaxPromise;

export type RegistApi<C extends Record<string, MethodUrl>> = {
  [P in keyof C]: TransApiResult<C[P]>;
};
