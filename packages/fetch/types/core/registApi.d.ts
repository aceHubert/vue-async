import { FetchClient, MethodUrl, MethodUrlFn, RegistApi, RequestConfig } from '../types';
export declare function defineApi<C extends Record<string, MethodUrl>>(options: C): C;
export declare function typedUrl<R = any, P = any, D = any>(strings: TemplateStringsArray, ...keys: Array<string | Function>): MethodUrlFn<R, P, D>;
export declare function typedUrl<R = any, P = any, D = any>(config: Partial<RequestConfig>): (strings: TemplateStringsArray, ...keys: Array<string | Function>) => MethodUrlFn<R, P, D>;
export declare function registApi<C extends Record<string, MethodUrl>>(client: FetchClient, apis: C, prefix?: string): RegistApi<C>;
