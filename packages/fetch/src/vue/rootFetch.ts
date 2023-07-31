import { getCurrentInstance, InjectionKey, inject } from 'vue-demi';
import { debug } from '../env';

// Types
import type { Fetch } from '../types';

/**
 * activeFetch must be called to handle SSR at the top of functions like
 * `fetch`, `setup`, `serverPrefetch` and others
 */
export let activeFetch: Fetch | undefined;

/**
 * inject key
 */
export const fetchSymbol: InjectionKey<Fetch> = debug ? Symbol.for('__VUE_ASYNC_Fetch__') : Symbol();

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
