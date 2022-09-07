import { FetchClient, MethodUrl, MethodUrlFn, RegistApi, RequestConfig } from '../types';
/**
 * typed url with no local config
 * @param strings TemplateStringsArray
 * @param keys string key or function, function first argument is request params
 * @returns the method url format function
 */
export declare function typedUrl<R = any, P = any, D = any>(
  strings: TemplateStringsArray,
  ...keys: Array<string | Function>
): MethodUrlFn<R, P, D>;
/**
 * typed url with local config
 * @param config local config object
 * @returns template literals function
 */
export declare function typedUrl<R = any, P = any, D = any>(
  config: Partial<RequestConfig>,
): (strings: TemplateStringsArray, ...keys: Array<string | Function>) => MethodUrlFn<R, P, D>;
/**
 * 定义 api
 * @param client fetch client
 * @param apis  typed urls
 * @param prefix base url
 * @returns named fetch requests
 */
export declare function registApi<C extends Record<string, MethodUrl>>(
  client: FetchClient,
  apis: C,
  prefix?: string,
): RegistApi<C>;
