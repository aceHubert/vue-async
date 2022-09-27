import warning from 'warning';
import axios from 'axios';
import { debug } from '../env';

// Types
import type { AxiosInstance, AxiosError } from 'axios';
import type { RequestConfig, FetchPromise } from '@vue-async/fetch';
import type { CatchErrorOptions } from '../types';

const defaultOptions: CatchErrorOptions = {
  handler: (error: Error) => {
    warning(
      !debug,
      `Error is catched by default handler and stop propagation error out, Error message: ${error.message}`,
    );
    return new Promise(() => {});
  },
};

const isAxiosError = axios.isAxiosError;
const isCancelError = axios.isCancel;

function catchErrorHandler(error: AxiosError, handler: CatchErrorOptions['handler']) {
  const { config } = error;
  if (!config?.catchError) return Promise.reject(error);
  return handler?.(error);
}

function promisify<T>(promise: T | PromiseLike<T>): Promise<T> {
  if (promise && promise instanceof Promise && typeof promise.then === 'function') {
    return promise;
  }
  return Promise.resolve(promise);
}

/**
 * use axios.interceptors to catch errors.
 * do not change the return type from interceptors
 * with "AxiosResponse" ans "AxiosError", next handler functions need it
 * @param axiosInstance axios instance
 * @param options catch error options
 */
export function applyCatchError(axiosInstance: AxiosInstance, options: CatchErrorOptions = {}) {
  const curOptions = { ...defaultOptions, ...options };
  axiosInstance.interceptors.request.use(undefined, (error) => {
    if (!isAxiosError(error)) {
      warning(!debug, `catchError needs "AxiosError" config, please do not chage format from interceptors return! `);
      return Promise.reject(error);
    }

    return catchErrorHandler(error, curOptions.handler);
  });
  axiosInstance.interceptors.response.use(
    (response) => {
      if (!response?.config) {
        warning(!debug, `loading needs "response" config, please do not chage format from interceptors return! `);
        return response;
      }

      if (curOptions.serializerData) {
        return promisify(curOptions.serializerData(response.data))
          .then((data) => {
            response.data = data;
            return response;
          })
          .catch((error) => {
            if (isAxiosError(error)) {
              return Promise.reject(error);
            } else {
              return Promise.reject(
                new axios.AxiosError(
                  error instanceof Error ? error.message : error,
                  error?.code || 'FROM_SERIALIZER_DATA_ERROR',
                  response.config,
                  response.request,
                  response,
                ),
              );
            }
          });
      }

      return response;
    },
    (error) => {
      if (!isAxiosError(error)) {
        warning(!debug, `catchError needs "AxiosError" config, please do not chage format from interceptors return! `);
        return Promise.reject(error);
      } else if (isCancelError(error)) {
        // cancel
        return Promise.reject(error);
      }
      return catchErrorHandler(error, curOptions.handler);
    },
  );
}

/**
 * regist catch error plugin on current promise request
 * @param request request promise
 * @param options catch error options
 */
export function registCatchError<T = any, R = T, C extends Partial<RequestConfig> = any>(
  request: (config: C) => FetchPromise<T>,
  options: CatchErrorOptions = {},
): (config: C) => FetchPromise<R> {
  const curOptions = { ...defaultOptions, ...options };
  return (config) => {
    return request(config)
      .then((response) => {
        if (curOptions.serializerData) {
          return promisify(curOptions.serializerData(response.data)).then(
            (data) => {
              response.data = data as any;
              return response;
            },
            (error) => {
              if (isAxiosError(error)) {
                return Promise.reject(error);
              } else {
                return Promise.reject(
                  new axios.AxiosError(
                    error instanceof Error ? error.message : error,
                    error?.code || 'FROM_SERIALIZER_DATA_ERROR',
                    response.config,
                    response.request,
                    response,
                  ),
                );
              }
            },
          );
        }
        return response;
      })
      .catch((error) => {
        // TIP: catch 参捕获到 then 中抛出的异常
        if (!isAxiosError(error)) {
          warning(
            !debug,
            `catchError needs "AxiosError" config, please do not chage format from interceptors return! `,
          );
          return Promise.reject(error);
        } else if (isCancelError(error)) {
          // cancel
          return Promise.reject(error);
        }
        return catchErrorHandler(error, curOptions.handler);
      });
  };
}

declare module 'axios' {
  /**
   * @internal
   */
  export interface AxiosStatic {
    AxiosError: typeof AxiosError;
  }
  export interface AxiosRequestConfig {
    catchError?: boolean;
  }
}

declare module '@vue-async/fetch/types/types' {
  export interface RequestConfig {
    /**
     * 启用异常全局处理，
     * 或通过Promise.catch捕获异常
     */
    catchError?: boolean;
  }
}
