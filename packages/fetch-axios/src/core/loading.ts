import warning from 'warning';
import axios from 'axios';
import { debug } from '../env';

// Types
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { LoadingHandler, LoadingOptions } from '../types';

export const StopLoadingFnSymbol = '__StopLoading__';
export const ResponseFinishedSymbol = '__LoadingResponseFinished__';

const defaultOptions: LoadingOptions = {
  delay: 260,
  handler: undefined,
};

const isAxiosError = axios.isAxiosError;

function startLoading(config: AxiosRequestConfig, handler: LoadingHandler, delay: number) {
  if (delay > 0) {
    // delay
    setTimeout(() => {
      // response 已经返回， handler 不执行
      config[StopLoadingFnSymbol] !== ResponseFinishedSymbol && (config[StopLoadingFnSymbol] = handler());
    }, delay);
  } else {
    config[StopLoadingFnSymbol] = handler();
  }
}

function stopLoading(config: AxiosRequestConfig) {
  const { [StopLoadingFnSymbol]: stopLoadingFnOrSymbol } = config;
  // 设置 response 已结束， delay 将不再执行 handler
  config[StopLoadingFnSymbol] = ResponseFinishedSymbol;
  stopLoadingFnOrSymbol && stopLoadingFnOrSymbol !== ResponseFinishedSymbol && stopLoadingFnOrSymbol();
}

/**
 * register loading handler
 * @param axios axios instance
 * @param options loading options
 * @param useOptions interceptor use options
 */
export function registLoading(
  axios: AxiosInstance,
  options: LoadingOptions,
  runWhen: (config: AxiosRequestConfig) => boolean = () => true,
) {
  const curOptions = { ...defaultOptions, ...options };

  axios.interceptors.request.use(
    (config) => {
      const { loading } = config;
      let delay = curOptions.delay || 0;
      let loadingFn = curOptions.handler;
      // 如果有本地设置
      if (loading && typeof loading !== 'boolean') {
        if (typeof loading === 'function') {
          loadingFn = loading;
        } else {
          loading.delay !== void 0 && (delay = loading.delay);
          loadingFn = loading.handler;
        }
      }
      // loading 设置为true 或本地定义时并且loading 函数被设置时启动
      if (!!loading && loadingFn) {
        startLoading(config, loadingFn, delay);
      }
      return config;
    },
    undefined,
    { runWhen },
  );
  axios.interceptors.response.use(
    (response) => {
      if (!response?.config) {
        warning(!debug, `loading needs "response" config, please do not chage format from interceptors return! `);
        return response;
      }
      // runWhen not works on response, https://github.com/axios/axios/issues/4792
      if (runWhen(response.config)) {
        stopLoading(response.config);
      }
      return response;
    },
    (error) => {
      if (!isAxiosError(error)) {
        warning(!debug, `loading needs "AxiosError" config, please do not chage format from interceptors return! `);
        return Promise.reject(error);
      }
      // runWhen not works on response, https://github.com/axios/axios/issues/4792
      if (runWhen(error.config)) {
        stopLoading(error.config);
      }
      return Promise.reject(error);
    },
  );
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    loading?: boolean | LoadingHandler | Required<LoadingOptions>;
    [StopLoadingFnSymbol]?: typeof ResponseFinishedSymbol | ReturnType<LoadingHandler>;
  }
}

declare module '@vue-async/fetch/types/types' {
  export interface RequestConfig {
    /**
     * 启用加载，或自定义加载方法
     */
    loading?: boolean | LoadingHandler | Required<LoadingOptions>;
  }
}
