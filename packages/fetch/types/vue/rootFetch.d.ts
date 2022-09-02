import { App, InjectionKey } from 'vue-demi';
import { MethodUrl, FetchClient, RegistApi, RegistApiCustomProperties, DefineRegistApiOptionsInPlugin } from '../types';
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
export declare const setActiveFetch: (fetch: Fetch | undefined) => Fetch | undefined;
/**
 * Get the currently active fetch if there is any.
 */
export declare const getActiveFetch: () => Fetch | undefined;
export declare const fetchSymbol: InjectionKey<Fetch>;
export interface Fetch {
    /**
     * Install fetch plugin
     */
    install: (app: App) => void;
    /**
     * Current fetch client with `Vue.createFetch()`
     */
    client: FetchClient;
    /**
     * Add a plugin to use every regist api
     */
    use: (plugin: RegistApiPlugin) => Fetch;
}
/**
 * Context argument passed to RegistApiPlugins.
 */
export interface RegisterPluginContext<C extends Record<string, MethodUrl> = any> {
    /**
     * Register id
     */
    id: string;
    /**
     * Fetch
     */
    fetch: Fetch;
    /**
     * Current app created with `Vue.createApp()`.
     */
    app: App;
    /**
     * regist apis
     */
    registApis: RegistApi<C>;
    /**
     * regist api options
     */
    options: DefineRegistApiOptionsInPlugin<C>;
}
/**
 * Plugin to extend every store.
 */
export interface RegistApiPlugin {
    /**
     * Plugin to extend every registApi.
     * @param context - RegisterPluginContext
     */
    (context: RegisterPluginContext): Partial<RegistApiCustomProperties> | void;
}
