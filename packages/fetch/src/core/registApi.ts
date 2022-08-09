import {
  FetchClient,
  Method,
  MethodUrl,
  MethodUrlWithConfig,
  MethodUrlFn,
  TransApiResult,
  RegistApi,
  RequestConfig,
  FetchPromise,
} from '../types';

const REQUEST_HEADERS = {
  form: { 'Content-Type': 'application/x-www-form-urlencoded' },
  json: { 'Content-Type': 'application/json;charset=utf-8' },
};

export function defineApi<C extends Record<string, MethodUrl>>(options: C): C {
  return options;
}

function formatRequestPath(
  params: Record<string, any>,
  strings: TemplateStringsArray,
  keys: Array<string | Function>,
): string {
  var result = [strings[0]];
  keys.forEach(function (key, i) {
    var value = typeof key === 'function' ? key(params) : params[key];
    result.push(value, strings[i + 1]);
  });
  return result.join('');
}

export function typedUrl<R = any, P = any, D = any>(
  strings: TemplateStringsArray,
  ...keys: Array<string | Function>
): MethodUrlFn<R, P, D>;
export function typedUrl<R = any, P = any, D = any>(
  config: Partial<RequestConfig>,
): (strings: TemplateStringsArray, ...keys: Array<string | Function>) => MethodUrlFn<R, P, D>;
export function typedUrl<R, P, D>(
  configOrStrings: Partial<RequestConfig> | TemplateStringsArray,
  ...keys: Array<string | Function>
): MethodUrlFn<R, P, D> | ((strings: TemplateStringsArray, ...keys: Array<string | Function>) => MethodUrlFn<R, P, D>) {
  // withConfig
  if (!Array.isArray(configOrStrings)) {
    return function (strings: TemplateStringsArray, ...innerKeys: Array<string | Function>) {
      return function (params: P): MethodUrlWithConfig {
        return [configOrStrings as Partial<RequestConfig>, formatRequestPath(params, strings, innerKeys)];
      };
    };
  } else {
    return function (params: P): string {
      return formatRequestPath(params, configOrStrings as TemplateStringsArray, keys);
    };
  }
}

export function registApi<C extends Record<string, MethodUrl>>(client: FetchClient, apis: C, prefix?: string): RegistApi<C> {
  const result = {} as RegistApi<C>;
  Object.keys(apis).forEach((methodName) => {
    const methodUrl = apis[methodName];
    result[methodName as keyof C] = transfromToRequest(client, methodUrl, prefix) as any;
  });
  return result;
}

function transfromToRequest(
  request: (url: string, config?: RequestConfig) => FetchPromise,
  methodUrl: MethodUrl,
  prefix = '',
): TransApiResult<MethodUrl> {
  return (config: Partial<RequestConfig> = {}) => {
    let { requestType = 'json' } = config;
    let methodInfo = methodUrl as string | [Partial<RequestConfig>, string];
    if (typeof methodUrl === 'function') {
      methodInfo = methodUrl(config.params);
    }
    let reqConfig = config;
    if (Array.isArray(methodInfo)) {
      const [cusConfig, methodPath] = methodInfo;
      reqConfig = { ...reqConfig, ...cusConfig };
      methodInfo = methodPath;
    }

    // 获取 方法 和 地址
    const arrMethodInfo = methodInfo.split(' ');
    const [method, urlPath] = arrMethodInfo.length === 1 ? ['get', methodInfo] : arrMethodInfo;
    const url = `${prefix}${prefix.endsWith('/') ? '' : '/'}${
      urlPath.startsWith('/') ? urlPath.substring(1) : urlPath
    }`;
    reqConfig.method = method as Method;

    // getLike 请求把data 参数当成 params 传递
    const isGetLike = ['get', 'delete', 'head', 'options'].includes(method);
    reqConfig.params = isGetLike ? { ...reqConfig.data, ...reqConfig.params } : reqConfig.params;
    reqConfig.headers = {
      ...(REQUEST_HEADERS[requestType] || {}),
      ...(reqConfig.headers || {}),
    };

    return request(url, reqConfig);
  };
}
