import { AxiosInstance, AxiosRequestConfig } from 'axios';

export type LoadingHandler = () => () => void;

export type LoadingOptions = {
  /**
   * 延迟调用处理方法毫秒数，默认值：260
   */
  delay?: number;
  /**
   * 全局 loading 处理方法
   */
  handler?: LoadingHandler;
};

export const StopLoadingFnSymbol = '__StopLoading__';
export const ResponseFinishedSymbol = '__LoadingResponseFinished__';

const defaultOptions: LoadingOptions = {
  delay: 260,
  handler: undefined,
};

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

export function registLoading(axios: AxiosInstance, options: LoadingOptions) {
  const curOptions = { ...defaultOptions, ...options };

  axios.interceptors.request.use((config) => {
    const { loading } = config;
    const delay = curOptions.delay || 0;
    const loadingFn = typeof loading === 'function' ? loading : curOptions.handler;
    if (!!loading && loadingFn) {
      startLoading(config, loadingFn, delay);
    }
    return config;
  });
  axios.interceptors.response.use(
    (response) => {
      stopLoading(response.config);
      return response;
    },
    (error) => {
      if (!error.config) return Promise.reject(error);
      stopLoading(error.config);
      return Promise.reject(error);
    },
  );
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    loading?: boolean | LoadingHandler;
    [StopLoadingFnSymbol]?: typeof ResponseFinishedSymbol | ReturnType<LoadingHandler>;
  }
}

// @ts-ignore
declare module '@vue-async/fetch' {
  export interface RequestConfig {
    loading?: boolean | LoadingHandler;
  }
}
