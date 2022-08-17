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

/**
 * format request path
 * checking on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
 * @param params request params
 * @param strings template literals string array
 * @param keys template literals key array
 * @returns formatted string
 */
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

/**
 * typed url with no local config
 * @param strings TemplateStringsArray
 * @param keys string key or function, function first argument is request params
 * @returns the method url format function
 */
export function typedUrl<R = any, P = any, D = any>(
  strings: TemplateStringsArray,
  ...keys: Array<string | Function>
): MethodUrlFn<R, P, D>;
/**
 * typed url with local config
 * @param config local config object
 * @returns template literals function
 */
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

/**
 * 定义 api
 * @param client fetch client
 * @param apis  typed urls
 * @param prefix base url
 * @returns named fetch requests
 */
export function registApi<C extends Record<string, MethodUrl>>(
  client: FetchClient,
  apis: C,
  prefix?: string,
): RegistApi<C> {
  const result = {} as RegistApi<C>;
  Object.keys(apis).forEach((methodName) => {
    const methodUrl = apis[methodName];
    result[methodName as keyof C] = transfromToRequest(client, methodUrl, methodName, prefix) as any;
  });
  return result;
}

function transfromToRequest(
  request: (url: string, config?: RequestConfig) => FetchPromise,
  methodUrl: MethodUrl,
  methodName: string,
  prefix = '',
): TransApiResult<MethodUrl> {
  return (config: Partial<RequestConfig> = {}) => {
    let { requestType = 'json' } = config;

    // method url 置换
    let _methodUrl = methodUrl as string | [Partial<RequestConfig>, string];
    if (typeof methodUrl === 'function') {
      _methodUrl = methodUrl(config.params);
    }
    let reqConfig = config;
    if (Array.isArray(_methodUrl)) {
      const [cusConfig, methodPath] = _methodUrl;
      reqConfig = { ...reqConfig, ...cusConfig };
      _methodUrl = methodPath;
    }

    // 置换 方法 和 地址
    // example:
    //  'getUser' => 'get getUser'
    //  'post updateUser'
    const _methodUrlArr = _methodUrl.split(' ');
    const [method, urlPath] = _methodUrlArr.length === 1 ? ['get', _methodUrl] : _methodUrlArr;
    // 拼接 prefix (处理prefix 末尾以及 urlPath 开始 / 的重复)
    const url = `${prefix}${prefix.endsWith('/') ? '' : '/'}${
      urlPath.startsWith('/') ? urlPath.substring(1) : urlPath
    }`;
    reqConfig.method = method as Method;
    // getLike 请求把data 参数当成 params 传递
    // const isGetLike = ['get', 'delete', 'head', 'options'].includes(method);
    // reqConfig.params = isGetLike ? { ...reqConfig.data, ...reqConfig.params } : reqConfig.params;
    // headers 默认值设置
    reqConfig.headers = {
      ...(REQUEST_HEADERS[requestType] || {}),
      ...(reqConfig.headers || {}),
    };

    // 标记为通过 registApi 注册
    reqConfig._registId = `${prefix}/${methodName}`;

    return request(url, reqConfig);
  };
}
