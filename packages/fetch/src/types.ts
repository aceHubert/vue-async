import type { App } from 'vue-demi';

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
  signal?: AbortSignal;
  // 请求的的数据类型 json / form(x-www-form-urlencoded)
  requestType?: RequestType;
  responseType?: ResponseType;
  validateStatus?: ((status: number) => boolean) | null;
  /**
   * From 'registApi' unique id
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

export interface Fetch {
  /**
   * Install fetch plugin
   */
  install: (app: App) => void;
  /**
   * Current fetch client with `Vue.createFetch()`
   */
  client: FetchClient;
  /**
   * Add a plugin to use every regist api
   */
  use: (plugin: RegistApiPlugin) => Fetch;
  /**
   * App linked to this Fetch instance
   * @internal
   */
  _a: App;
  /**
   * Installed regist api plugins
   *
   * @internal
   */
  _p: RegistApiPlugin[];
  /**
   * stored regist apis
   * @internal
   */
  _r: Map<string, RegistApi<any>>;
}

/**
 * Context argument passed to RegistApiPlugins.
 */
export interface RegisterPluginContext<C extends Record<string, MethodUrl> = any> {
  /**
   * Register id
   */
  id: string;
  /**
   * Fetch
   */
  fetch: Fetch;
  /**
   * Current app created with `Vue.createApp()`.
   */
  app: App;
  /**
   * regist apis
   */
  registApis: RegistApi<C>;
  /**
   * regist api options
   */
  options: DefineRegistApiOptionsInPlugin<C>;
}

/**
 * Plugin to extend every store.
 */
export interface RegistApiPlugin {
  /**
   * Plugin to extend every registApi.
   * @param context - RegisterPluginContext
   */
  (context: RegisterPluginContext): Partial<RegistApiCustomProperties> | void;
}

/**
 *  'defineRegistApi' options
 */
export interface DefineRegistApiOptions<C extends Record<string, MethodUrl>> {
  /**
   * Cached id
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
   * Base URL
   */
  prefix?: string;
  /**
   * Plugins apply current registApis
   */
  plugins?: RegistApiPlugin[];
}

/**
 * Options use for plugin
 */
export interface DefineRegistApiOptionsInPlugin<C extends Record<string, MethodUrl>>
  extends Omit<DefineRegistApiOptions<C>, 'id'> {}

/**
 * Custom registApis properties extends from plugin
 */
export interface RegistApiCustomProperties<C extends Record<string, MethodUrl> = {}> {}

/**
 * Return type of 'defineRegistApi' result
 */
export interface RegistApiDefinition<C extends Record<string, MethodUrl>> {
  (fetch?: Fetch): RegistApi<C>;
}
