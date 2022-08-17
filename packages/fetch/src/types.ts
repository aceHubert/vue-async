import { Fetch } from './vue/rootFetch';

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

/**
 * request config
 */
export interface RequestConfig<D = any> {
  url?: string;
  method?: Method | string;
  headers?: any;
  params?: any;
  data?: D;
  // 请求的的数据类型 json / form(x-www-form-urlencoded)
  requestType?: RequestType;
  responseType?: ResponseType;
  validateStatus?: ((status: number) => boolean) | null;
  /**
   * From 'registApi' unique id, format to `{prefix}/{methodName}`
   * @internal
   */
  _registId?: string;
}

/**
 * response
 */
export interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: RequestConfig;
  request?: any;
}

export interface FetchPromise<T = any> extends Promise<Response<T>> {}

/**
 * fetch client
 */
export interface FetchClient {
  (config: RequestConfig): FetchPromise;
  (url: string, config?: RequestConfig): FetchPromise;

  request<T = any, R = Response<T>>(config: RequestConfig): Promise<R>;
  get<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
  delete<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
  head<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
  options<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
  post<T = any, R = Response<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
  put<T = any, R = Response<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
  patch<T = any, R = Response<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;
}

/**
 * method url definition
 */
export type MethodUrl = string | MethodUrlWithConfig | MethodUrlFn;
/**
 * method url with local config
 */
export type MethodUrlWithConfig = [Partial<RequestConfig>, string];
/**
 * function method url
 */
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

/**
 * method url transfor to request definition
 */
export type TransApiResult<MethodUrl> = MethodUrl extends MethodUrlFn<infer Result, infer Params, infer Data>
  ? CheckAny<Params> extends 'yes'
    ? (
        config?: Partial<Omit<RequestConfig, 'params' | 'data'> & { params?: Params; data?: Data }>,
      ) => FetchPromise<Result>
    : (
        config: Partial<Omit<RequestConfig, 'params' | 'data'>> & { params: Params; data?: Data },
      ) => FetchPromise<Result>
  : (config?: Partial<RequestConfig>) => FetchPromise;

/**
 * Return type of 'registApi' result
 */
export type RegistApi<C extends Record<string, MethodUrl>> = {
  [P in keyof C]: TransApiResult<C[P]>;
};

/**
 *  'defineRegistApi' options
 */
export interface DefineRegistApiOptions<C extends Record<string, MethodUrl>> {
  /**
   * cached id
   */
  id: string;
  /**
   * Register api object
   * example: {
   *  getUsers: typedUrl<User[]>`get /users`,
   *  getUser: typedUrl<User, { id: string | number }>`/user/${'id'}`,
   *  addUser: typedUrl<User, any, Partial<Omit<User, 'id'>>>`post /user`,
   *  updateFile: typedUrl<string>({headers:{'content-type':'form-data'}})`post /upload/image`
   * }
   */
  apis: C;
  /**
   * base url
   */
  prefix?: string;
}

/**
 * Options use for plugin
 */
export interface DefineRegistApiOptionsInPlugin<C extends Record<string, MethodUrl>>
  extends Omit<DefineRegistApiOptions<C>, 'id'> {}

/**
 * Return type of 'defineRegistApi' result
 */
export interface RegistApiDefinition<C extends Record<string, MethodUrl>> {
  (fetch?: Fetch): RegistApi<C>;
}
