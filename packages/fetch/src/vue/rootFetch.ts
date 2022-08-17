import { App, getCurrentInstance, InjectionKey, inject } from 'vue-demi';
import { debug } from '../env';
import { MethodUrl, FetchClient, RegistApi, DefineRegistApiOptionsInPlugin } from '../types';

/**
 * activeFetch must be called to handle SSR at the top of functions like
 * `fetch`, `setup`, `serverPrefetch` and others
 */
export let activeFetch: Fetch | undefined;

/**
 * Set or unset active fetch, Used in SSR and internally when calling
 * actions and getters
 * @param fetch Fetch instance
 */
export const setActiveFetch = (fetch: Fetch | undefined) => (activeFetch = fetch);

/**
 * Get the currently active fetch if there is any.
 */
export const getActiveFetch = () => (getCurrentInstance() && inject(fetchSymbol)) || activeFetch;

export const fetchSymbol: InjectionKey<Fetch> = debug ? Symbol.for('__Fetch__') : Symbol();

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
  /**
   * App linked to this Fetch instance
   * @internal
   */
  _a: App;
  /**
   * Installed regist api plugins
   *
   * @internal
   */
  _p: RegistApiPlugin[];
  /**
   * stored regist apis
   * @internal
   */
  _r: Map<string, RegistApi<any>>;
}

/**
 * Context argument passed to RegistApiPlugins.
 */
export interface RegisterPluginContext<C extends Record<string, MethodUrl> = any> {
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
  (context: RegisterPluginContext): void;
}
