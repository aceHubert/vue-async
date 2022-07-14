import { App, InjectionKey } from 'vue-demi';
import { FetchClient, RegistApi, MethodUrl } from '../types';
/**
 * activeFetch must be called to handle SSR at the top of functions like
 * `fetch`, `setup`, `serverPrefetch` and others
 */
export declare let activeFetch: Fetch | undefined;
/**
 * Set or unset active fetch, Used in SSR and internally when calling
 * actions and getters
 * @param fetch Fetch instance
 */
export declare const setActiveFetch: (fetch: Fetch | undefined) => Fetch<any> | undefined;
/**
 * Get the currently active fetch if there is any.
 */
export declare const getActiveFetch: <C extends Record<string, MethodUrl> = any>() => Fetch<C>;
export declare const fetchSymbol: InjectionKey<Fetch>;
export declare type FetchOptions = {
    /**
     * Register api object
     * example: {
     *  getUsers: typedUrl<User[]>`get /users`,
     *  getUser: typedUrl<User, { id: string | number }>`/user/${'id'}`,
     *  addUser: typedUrl<User, any, Partial<Omit<User, 'id'>>>`post /user`,
     * }
     */
    apis: Record<string, MethodUrl>;
    /**
     * Current fetch baseUrl with `Vue.createFetch()`, Default: `/`
     */
    prefix?: string;
};
export interface Fetch<C extends Record<string, MethodUrl> = any> {
    /**
     * Install fetch plugin
     */
    install: (app: App) => void;
    /**
     * Current fetch client with `Vue.createFetch()`
     */
    client: FetchClient;
    /**
     * Registered api functions
     */
    registApis: RegistApi<C>;
}
export interface FetchPluginContext {
    /**
     * Fetch instance
     */
    fetch: FetchClient;
    /**
     * Current app created with `Vue.createApp()`.
     */
    app: App;
}
export interface FetchPlugin {
    (context: FetchPluginContext): void;
}
