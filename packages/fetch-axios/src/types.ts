import {
  AxiosTransformer,
  AxiosAdapter,
  AxiosBasicCredentials,
  AxiosProxyConfig,
  CancelToken,
  TransitionalOptions,
} from 'axios';

// @ts-ignore
declare module '@vue-async/fetch' {
  export interface RequestConfig {
    transformRequest?: AxiosTransformer | AxiosTransformer[];
    transformResponse?: AxiosTransformer | AxiosTransformer[];
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    paramsSerializer?: (params: any) => string;
    adapter?: AxiosAdapter;
    auth?: AxiosBasicCredentials;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    maxBodyLength?: number;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    proxy?: AxiosProxyConfig | false;
    cancelToken?: CancelToken;
    decompress?: boolean;
    transitional?: TransitionalOptions;
  }
}
