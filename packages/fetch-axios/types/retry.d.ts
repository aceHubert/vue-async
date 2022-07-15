import { AxiosInstance, AxiosError } from 'axios';
export declare type RetryOptions = {
    /**
     * 最大重试试次数，默认值：3
     */
    maxCount?: number;
    /**
     * 重试延迟(formula(2 ^ c - 1 / 2) * 1000 毫秒数)，默认值：true
     */
    delay?: boolean;
    /**
     * 自定义重试条件，默认值：没有response返回并且错误信息为`Network Error`
     */
    validateError?: (error: AxiosError) => boolean;
};
export declare const RetryCountSymbol = "__RetryCount__";
export declare function registRetry(axios: AxiosInstance, options: RetryOptions): void;
declare module 'axios' {
    interface AxiosRequestConfig {
        retry?: boolean | RetryOptions;
        [RetryCountSymbol]?: number;
    }
}
declare module '@vue-async/fetch' {
    interface RequestConfig {
        retry?: boolean | RetryOptions;
    }
}
