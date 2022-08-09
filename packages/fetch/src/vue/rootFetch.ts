import { App, getCurrentInstance, InjectionKey, inject } from 'vue-demi';
import { debug } from '../env';

// Types
import { FetchClient, RegistApi, MethodUrl } from '../types';

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
export const getActiveFetch = <C extends Record<string, MethodUrl> = any>() =>
  ((getCurrentInstance() && inject(FetchSymbol)) || activeFetch) as Fetch<C>;

export const FetchSymbol: InjectionKey<Fetch> = debug ? Symbol.for('__Fetch__') : Symbol();

export type FetchOptions = {
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
  /**
   * App linked to this Fetch instance
   * @internal
   */
  _a: App;
  /**
   * Options with  `Vue.createFetch()`
   * @internal
   */
  _o: FetchOptions;
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
