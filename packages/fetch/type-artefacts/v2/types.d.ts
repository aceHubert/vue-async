import * as VueDemi from 'vue-demi';
declare class Helper<Props> {
  Return: import('vue').ComponentOptions<
    import('vue').default,
    VueDemi.ShallowUnwrapRef<VueDemi.Data> & VueDemi.Data,
    {},
    {},
    Record<keyof Props, any>,
    VueDemi.ExtractPropTypes<Record<keyof Props, any>>
  > &
    Omit<import('vue').VueConstructor<import('vue').default>, never> &
    (new (...args: any[]) => VueDemi.ComponentRenderProxy<
      {
        [K_1 in keyof Pick<
          Record<keyof Props, any>,
          {
            [K in keyof Record<keyof Props, any>]: Record<keyof Props, any>[K] extends
              | BooleanConstructor
              | {
                  required: true;
                }
              | {
                  default: any;
                }
              | {
                  type: BooleanConstructor;
                }
              ? K
              : never;
          }[keyof Props]
        >]: Record<keyof Props, any>[K_1] extends null
          ? any
          : Record<keyof Props, any>[K_1] extends {
              type: true | null;
            }
          ? any
          : Record<keyof Props, any>[K_1] extends
              | ObjectConstructor
              | {
                  type: ObjectConstructor;
                }
          ? Record<string, any>
          : Record<keyof Props, any>[K_1] extends
              | BooleanConstructor
              | {
                  type: BooleanConstructor;
                }
          ? boolean
          : Record<keyof Props, any>[K_1] extends
              | DateConstructor
              | {
                  type: DateConstructor;
                }
          ? Date
          : Record<keyof Props, any>[K_1] extends FunctionConstructor
          ? Function
          : Record<keyof Props, any>[K_1] extends VueDemi.PropOptions<infer V, infer D> | VueDemi.PropType<infer V>
          ? unknown extends V
            ? D extends null | undefined
              ? V
              : D
            : V extends Function
            ? V extends (...args: any[]) => any
              ? ((...args: any[]) => any) & V
              : never
            : Exclude<V, Function>
          : Record<keyof Props, any>[K_1];
      } &
        {
          [K_2 in keyof Pick<
            Record<keyof Props, any>,
            Exclude<
              keyof Props,
              {
                [K in keyof Record<keyof Props, any>]: Record<keyof Props, any>[K] extends
                  | BooleanConstructor
                  | {
                      required: true;
                    }
                  | {
                      default: any;
                    }
                  | {
                      type: BooleanConstructor;
                    }
                  ? K
                  : never;
              }[keyof Props]
            >
          >]?:
            | (Record<keyof Props, any>[K_2] extends null
                ? any
                : Record<keyof Props, any>[K_2] extends {
                    type: true | null;
                  }
                ? any
                : Record<keyof Props, any>[K_2] extends
                    | ObjectConstructor
                    | {
                        type: ObjectConstructor;
                      }
                ? Record<string, any>
                : Record<keyof Props, any>[K_2] extends
                    | BooleanConstructor
                    | {
                        type: BooleanConstructor;
                      }
                ? boolean
                : Record<keyof Props, any>[K_2] extends
                    | DateConstructor
                    | {
                        type: DateConstructor;
                      }
                ? Date
                : Record<keyof Props, any>[K_2] extends FunctionConstructor
                ? Function
                : Record<keyof Props, any>[K_2] extends
                    | VueDemi.PropOptions<infer V, infer D>
                    | VueDemi.PropType<infer V>
                ? unknown extends V
                  ? D extends null | undefined
                    ? V
                    : D
                  : V extends Function
                  ? V extends (...args: any[]) => any
                    ? ((...args: any[]) => any) & V
                    : never
                  : Exclude<V, Function>
                : Record<keyof Props, any>[K_2])
            | undefined;
        },
      VueDemi.ShallowUnwrapRef<VueDemi.Data>,
      VueDemi.Data,
      {},
      {},
      {},
      {},
      {},
      {
        [K_1 in keyof Pick<
          Record<keyof Props, any>,
          {
            [K in keyof Record<keyof Props, any>]: Record<keyof Props, any>[K] extends
              | BooleanConstructor
              | {
                  required: true;
                }
              | {
                  default: any;
                }
              | {
                  type: BooleanConstructor;
                }
              ? K
              : never;
          }[keyof Props]
        >]: Record<keyof Props, any>[K_1] extends null
          ? any
          : Record<keyof Props, any>[K_1] extends {
              type: true | null;
            }
          ? any
          : Record<keyof Props, any>[K_1] extends
              | ObjectConstructor
              | {
                  type: ObjectConstructor;
                }
          ? Record<string, any>
          : Record<keyof Props, any>[K_1] extends
              | BooleanConstructor
              | {
                  type: BooleanConstructor;
                }
          ? boolean
          : Record<keyof Props, any>[K_1] extends
              | DateConstructor
              | {
                  type: DateConstructor;
                }
          ? Date
          : Record<keyof Props, any>[K_1] extends FunctionConstructor
          ? Function
          : Record<keyof Props, any>[K_1] extends VueDemi.PropOptions<infer V, infer D> | VueDemi.PropType<infer V>
          ? unknown extends V
            ? D extends null | undefined
              ? V
              : D
            : V extends Function
            ? V extends (...args: any[]) => any
              ? ((...args: any[]) => any) & V
              : never
            : Exclude<V, Function>
          : Record<keyof Props, any>[K_1];
      } &
        {
          [K_2 in keyof Pick<
            Record<keyof Props, any>,
            Exclude<
              keyof Props,
              {
                [K in keyof Record<keyof Props, any>]: Record<keyof Props, any>[K] extends
                  | BooleanConstructor
                  | {
                      required: true;
                    }
                  | {
                      default: any;
                    }
                  | {
                      type: BooleanConstructor;
                    }
                  ? K
                  : never;
              }[keyof Props]
            >
          >]?:
            | (Record<keyof Props, any>[K_2] extends null
                ? any
                : Record<keyof Props, any>[K_2] extends {
                    type: true | null;
                  }
                ? any
                : Record<keyof Props, any>[K_2] extends
                    | ObjectConstructor
                    | {
                        type: ObjectConstructor;
                      }
                ? Record<string, any>
                : Record<keyof Props, any>[K_2] extends
                    | BooleanConstructor
                    | {
                        type: BooleanConstructor;
                      }
                ? boolean
                : Record<keyof Props, any>[K_2] extends
                    | DateConstructor
                    | {
                        type: DateConstructor;
                      }
                ? Date
                : Record<keyof Props, any>[K_2] extends FunctionConstructor
                ? Function
                : Record<keyof Props, any>[K_2] extends
                    | VueDemi.PropOptions<infer V, infer D>
                    | VueDemi.PropType<infer V>
                ? unknown extends V
                  ? D extends null | undefined
                    ? V
                    : D
                  : V extends Function
                  ? V extends (...args: any[]) => any
                    ? ((...args: any[]) => any) & V
                    : never
                  : Exclude<V, Function>
                : Record<keyof Props, any>[K_2])
            | undefined;
        },
      VueDemi.ExtractDefaultPropTypes<Record<keyof Props, any>>,
      true
    >);
}
export declare type DefineComponent<Props> = Helper<Props>['Return'];
export declare type Method =
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
export declare type RequestType = 'json' | 'form';
export declare type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
export interface RequestConfig {
  url?: string;
  method?: Method;
  headers?: any;
  params?: any;
  data?: any;
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
export interface FetchPromise<T = any> extends Promise<Response<T>> {}
export interface Client {
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
export declare type MethodUrl = string | MethodUrlWithConfig | MethodUrlFn;
export declare type MethodUrlWithConfig = [Partial<RequestConfig>, string];
export declare type MethodUrlFn<R = any, P = any, D = any> = (params: P) => string | MethodUrlWithConfig;
/**
 * type isNever = CheckNever<any> => 'yes' | 'no'
 * type isNever = CheckNever<never> => never
 */
declare type CheckNever<T> = T extends never ? 'yes' : 'no';
/**
 * type isAny = CheckAny<any> => 'yes'
 * type isAny = CheckAny<never> => 'no'
 */
declare type CheckAny<T> = CheckNever<T> extends 'no' ? 'no' : 'yes';
export declare type TransApiResult<MethodUrl> = MethodUrl extends MethodUrlFn<infer Result, infer Params, infer Data>
  ? CheckAny<Params> extends 'yes'
    ? (
        config?: Partial<
          Omit<RequestConfig, 'params' | 'data'> & {
            params?: Params;
            data?: Data;
          }
        >,
      ) => FetchPromise<Result>
    : (
        config: Partial<Omit<RequestConfig, 'params' | 'data'>> & {
          params: Params;
          data?: Data;
        },
      ) => FetchPromise<Result>
  : (config?: Partial<RequestConfig>) => FetchPromise;
export declare type RegistApi<C extends Record<string, MethodUrl>> = {
  [P in keyof C]: TransApiResult<C[P]>;
};
export {};
