import warning from 'warning';

export type CatchErrorOptions = {
  /**
   * 全局 error catch 处理方法
   */
  handler?: (err: Error) => Promise<any>;
};

const defaultOptions: CatchErrorOptions = {
  handler: (error: Error) => {
    warning(
      process.env.NODE_ENV === 'production',
      `Error is catched by default handler and stop propagation error out, Error message: ${error.message}`,
    );
    return new Promise(() => {});
  },
};

function catchErrorHandler(error: AxiosError, options: CatchErrorOptions) {
  const { config } = error;
  if (!config?.catchError) return Promise.reject(error);
  return options.handler!(error);
}

export function registCatchError(fetch: AxiosInstance, options: CatchErrorOptions = {}) {
  const curOptions = { ...defaultOptions, ...options };
}

// @ts-ignore
declare module '@vue-async/ajax' {
  export interface RequestConfig {
    catchError?: boolean;
  }
}
